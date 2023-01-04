import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}

export function handleSummary(data) {
    // console.log(JSON.stringify(data));
    const duration = data.state.testRunDurationMs;
    
    // const nMetrics = data.metrics.length;
    // metrics is an Object where each field name corresponds to the metric name
    const nMetrics = Object.keys(data.metrics).length;

    console.log(`test run in ${duration}ms and generated ${nMetrics} metrics`);
}