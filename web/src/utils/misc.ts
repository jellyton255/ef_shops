// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

// Basic no operation function
export const noop = () => {};

export function commaValue(x: any) {
	if (x === undefined) return;
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatMoney(amount: number) {
	return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
