/**
 * Function and Class Hooking Utility
 * Provides comprehensive hooking capabilities for functions and classes
 */

// ============================================
// Usage Examples:  https://gist.github.com/maanimis/e36806517e809ac6b4ca9dfc79e1e041
// ============================================

/** biome-ignore-all lint/suspicious/noConfusingVoidType: false positive*/
/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */

// Types for hook callbacks
type BeforeHook<T extends any[] = any[]> = (...args: T) => void | [...T];
type AfterHook<T = any> = (result: T, ...args: any[]) => T | void;
type ErrorHook = (error: Error, ...args: any[]) => void;

interface HookConfig<T extends any[] = any[], R = any> {
  before?: BeforeHook<T>;
  after?: AfterHook<R>;
  onError?: ErrorHook;
  onFinally?: () => void;
}

/**
 * Hook a single function with before/after/error/finally callbacks
 */
export function hookFunction<T extends (...args: any[]) => any>(
  fn: T,
  config: HookConfig<Parameters<T>, ReturnType<T>>,
): T {
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    let modifiedArgs = args;

    // Execute before hook
    if (config.before) {
      const beforeResult = config.before(...args);
      if (beforeResult !== undefined) {
        modifiedArgs = beforeResult as Parameters<T>;
      }
    }

    try {
      // Execute original function
      let result = fn.apply(this, modifiedArgs);

      // Execute after hook
      if (config.after) {
        const afterResult = config.after(result, ...modifiedArgs);
        if (afterResult !== undefined) {
          result = afterResult;
        }
      }

      return result;
    } catch (error) {
      // Execute error hook
      if (config.onError) {
        config.onError(error as Error, ...modifiedArgs);
      }
      throw error;
    } finally {
      // Execute finally hook
      if (config.onFinally) {
        config.onFinally();
      }
    }
  } as T;
}

/**
 * Hook all methods of a class instance
 */
export function hookInstance<T extends object>(
  instance: T,
  config: HookConfig | ((methodName: string) => HookConfig),
): T {
  const proto = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(proto);

  propertyNames.forEach((name) => {
    if (name === "constructor") return;

    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (!descriptor || typeof descriptor.value !== "function") return;

    const originalMethod = descriptor.value;
    const methodConfig = typeof config === "function" ? config(name) : config;

    descriptor.value = hookFunction(originalMethod, methodConfig);
    Object.defineProperty(instance, name, descriptor);
  });

  return instance;
}

/**
 * Hook a class constructor and all its methods
 */
export function hookClass<T extends new (...args: any[]) => any>(
  TargetClass: T,
  config: {
    constructor?: HookConfig;
    methods?: HookConfig | ((methodName: string) => HookConfig);
  },
): T {
  // Create a proxy class that wraps the original
  const ProxyClass = new Proxy(TargetClass, {
    construct(target, args) {
      let modifiedArgs = args;

      // Hook constructor before
      if (config.constructor?.before) {
        const beforeResult = config.constructor.before(...args);
        if (beforeResult !== undefined) {
          modifiedArgs = beforeResult;
        }
      }

      let instance: InstanceType<T>;

      try {
        // Create instance
        instance = new target(...modifiedArgs);

        // Hook constructor after
        if (config.constructor?.after) {
          const afterResult = config.constructor.after(
            instance,
            ...modifiedArgs,
          );
          if (afterResult !== undefined) {
            instance = afterResult;
          }
        }

        // Hook all methods if specified
        if (config.methods) {
          hookInstance(instance, config.methods);
        }

        return instance;
      } catch (error) {
        if (config.constructor?.onError) {
          config.constructor.onError(error as Error, ...modifiedArgs);
        }
        throw error;
      } finally {
        if (config.constructor?.onFinally) {
          config.constructor.onFinally();
        }
      }
    },
  });

  return ProxyClass as T;
}

/**
 * Hook specific methods of a class by name
 */
export function hookMethods<T extends new (...args: any[]) => any>(
  TargetClass: T,
  methodHooks: Record<string, HookConfig>,
): T {
  const proto = TargetClass.prototype;

  Object.entries(methodHooks).forEach(([methodName, hookConfig]) => {
    const originalMethod = proto[methodName];
    if (typeof originalMethod === "function") {
      proto[methodName] = hookFunction(originalMethod, hookConfig);
    }
  });

  return TargetClass;
}

/**
 * Create a detachable hook that can be removed later
 */
export function createDetachableHook<T extends (...args: any[]) => any>(
  obj: any,
  methodName: string,
  config: HookConfig<Parameters<T>, ReturnType<T>>,
): () => void {
  const original: T = obj[methodName];
  if (typeof original !== "function") {
    throw new Error(`${methodName} is not a function`);
  }

  obj[methodName] = hookFunction<T>(original, config);

  // Return detach function
  return () => {
    obj[methodName] = original;
  };
}
