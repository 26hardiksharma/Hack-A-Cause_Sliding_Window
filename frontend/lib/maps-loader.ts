/**
 * Shared Google Maps JavaScript API script loader.
 * Ensures the script is injected exactly once regardless of how many
 * components call loadMapsScript on the same page or across navigations.
 */

let _ready = false;
const _queue: Array<() => void> = [];

export function loadMapsScript(apiKey: string, onReady: () => void): void {
    // Script already loaded — call back immediately
    if (_ready) {
        onReady();
        return;
    }

    _queue.push(onReady);

    // Script tag already injected — just wait for it
    if (document.querySelector('script[data-google-maps]')) return;

    const script = document.createElement('script');
    script.setAttribute('data-google-maps', '1');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
        _ready = true;
        _queue.forEach(cb => cb());
        _queue.length = 0;
    };
    document.head.appendChild(script);
}
