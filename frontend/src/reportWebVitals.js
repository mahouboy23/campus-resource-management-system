const reportWebVitals = onPerfEntry => {
    if (onPerfEntry && onPerfEntry.getCLS && onPerfEntry.getFID && onPerfEntry.getFCP && onPerfEntry.getLCP && onPerfEntry.getTTFB) {
        onPerfEntry.getCLS(console.log);
        onPerfEntry.getFID(console.log);
        onPerfEntry.getFCP(console.log);
        onPerfEntry.getLCP(console.log);
        onPerfEntry.getTTFB(console.log);
    }
};

export default reportWebVitals;
