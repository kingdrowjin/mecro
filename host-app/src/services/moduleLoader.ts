// Local type definitions for Module Federation
interface ModuleConfig {
  name: string;
  url: string;
  scope: string;
  module: string;
  isActive: boolean;
  routes?: string[];
  description?: string;
  version?: string;
}

interface ModuleRegistry {
  [key: string]: ModuleConfig;
}

interface LoadRemoteOptions {
  url: string;
  scope: string;
  module: string;
}

interface LoadedModule {
  [key: string]: React.ComponentType<any>;
}

class ModuleLoader {
  private loadedModules: Map<string, Promise<LoadedModule>> = new Map();
  private moduleConfig: ModuleRegistry | null = null;

  async loadModuleConfig(): Promise<ModuleRegistry> {
    if (this.moduleConfig) {
      return this.moduleConfig;
    }

    try {
      const response = await fetch('/module-config.json');
      if (!response.ok) {
        throw new Error(`Failed to load module config: ${response.statusText}`);
      }

      const config = await response.json();
      this.moduleConfig = config.modules;
      return this.moduleConfig as ModuleRegistry;
    } catch (error) {
      console.error('Error loading module configuration:', error);
      throw error;
    }
  }

  async loadRemoteModule(options: LoadRemoteOptions): Promise<LoadedModule> {
    const { url, scope, module } = options;
    const moduleKey = `${scope}/${module}`;

    // Return cached module if already loaded
    if (this.loadedModules.has(moduleKey)) {
      return this.loadedModules.get(moduleKey)!;
    }

    // Create loading promise
    const loadingPromise = this.loadModule(url, scope, module);
    this.loadedModules.set(moduleKey, loadingPromise);

    return loadingPromise;
  }

  private async loadModule(url: string, scope: string, module: string): Promise<LoadedModule> {
    try {
      // Initialize the shared scope
      // @ts-ignore
      await __webpack_init_sharing__('default');

      // Load the remote container
      const container = await this.loadScript(url, scope);

      // Initialize the container
      // @ts-ignore
      await container.init(__webpack_share_scopes__.default);

      // Get the module factory
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (error) {
      console.error(`Error loading remote module ${scope}/${module}:`, error);
      throw error;
    }
  }

  private loadScript(url: string, scope: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if the script is already loaded
      // @ts-ignore
      if (window[scope]) {
        // @ts-ignore
        return resolve(window[scope]);
      }

      // First, verify the URL returns valid JavaScript
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(scriptContent => {
          // Check if the response is HTML (common error case)
          if (scriptContent.trim().startsWith('<')) {
            throw new Error(`Expected JavaScript but received HTML from ${url}. This usually means the server returned an error page.`);
          }

          // If we get valid JavaScript, proceed with script loading
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = url;

          script.onload = () => {
            // @ts-ignore
            if (window[scope]) {
              // @ts-ignore
              resolve(window[scope]);
            } else {
              reject(new Error(`Unable to load scope ${scope} from ${url}. Script loaded but scope not found on window.`));
            }
          };

          script.onerror = () => {
            reject(new Error(`Failed to load script ${url}. Check if the remote module is running and accessible.`));
          };

          document.head.appendChild(script);
        })
        .catch(error => {
          reject(new Error(`Failed to fetch remote module from ${url}: ${error.message}`));
        });
    });
  }

  async getModuleByName(moduleName: string): Promise<LoadedModule> {
    const config = await this.loadModuleConfig();
    const moduleConfig = config[moduleName];

    if (!moduleConfig || !moduleConfig.isActive) {
      throw new Error(`Module ${moduleName} is not available or inactive`);
    }

    return this.loadRemoteModule({
      url: moduleConfig.url,
      scope: moduleConfig.scope,
      module: moduleConfig.module,
    });
  }

  async getAllActiveModules(): Promise<ModuleConfig[]> {
    const config = await this.loadModuleConfig();
    return Object.values(config).filter((module: ModuleConfig) => module.isActive);
  }

  isModuleLoaded(moduleName: string): boolean {
    return this.loadedModules.has(moduleName);
  }

  clearModuleCache(moduleName?: string): void {
    if (moduleName) {
      this.loadedModules.delete(moduleName);
    } else {
      this.loadedModules.clear();
    }
  }

  async reloadModule(moduleName: string): Promise<LoadedModule> {
    this.clearModuleCache(moduleName);
    return this.getModuleByName(moduleName);
  }
}

// Export singleton instance
export const moduleLoader = new ModuleLoader();
export default moduleLoader;