// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

// Basic no operation function
export const noop = () => {};

export function formatMoney(amount: number) {
	return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
