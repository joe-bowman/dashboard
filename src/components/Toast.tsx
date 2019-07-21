import { Intent, Position, Toaster } from "@blueprintjs/core";

/**
 * Singleton toaster instance. Create separate instances for different options.
 */
const ToasterAnimation = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP_RIGHT,
});

/**
 * Toast Class which exposes convenient to use methods.
 */
class Toast {
  info = (message: string) => renderToast(message, Intent.NONE);
  success = (message: string) => renderToast(message, Intent.SUCCESS);
  primary = (message: string) => renderToast(message, Intent.PRIMARY);
  warn = (message: string) => renderToast(message, Intent.WARNING);
  danger = (message: string) => renderToast(message, Intent.DANGER);
}

/**
 * Helper to render a toast with a specified intent.
 */
const renderToast = (message: string, intent: Intent) => {
  ToasterAnimation.show({
    message,
    intent,
  });
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default new Toast();
