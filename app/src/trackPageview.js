import { gaUa } from './config.js';

export default function trackPageview(ga) {
    ga('_setAccount', gaUa);
    ga('_trackPageview');
}