
import fs from 'fs';
import path from 'path';

const PRINTERS_DIR = 'public/foomatic-db/printer';
const DRIVERS_DIR = 'public/foomatic-db/driver';
const OUTPUT_FILE = 'public/foomatic-db/printers.json';

function getFunctionalityStatus(func) {
    switch (func) {
        case 'A':
            return 'perfect';
        case 'B':
            return 'good';
        case 'C':
            return 'partial';
        default:
            return 'unsupported';
    }
}

async function combineData() {
    const printers = new Map();
    const drivers = new Map();
    const printerToDrivers = new Map();

    // Load printers from PRINTERS_DIR
    const printerFiles = fs.readdirSync(PRINTERS_DIR);
    for (const file of printerFiles) {
        if (file.endsWith('.json')) {
            const printerData = JSON.parse(fs.readFileSync(path.join(PRINTERS_DIR, file), 'utf-8'));
            const printer = printerData.printer;
            printers.set(printer['@id'], printer);
        }
    }

    // Load drivers and find new printers
    const driverFiles = fs.readdirSync(DRIVERS_DIR);
    for (const file of driverFiles) {
        if (file.endsWith('.json')) {
            const driverData = JSON.parse(fs.readFileSync(path.join(DRIVERS_DIR, file), 'utf-8'));
            const driver = driverData.driver;
            drivers.set(driver['@id'], driver);

            if (driver.printers && driver.printers.printer) {
                const printerRefs = Array.isArray(driver.printers.printer) ? driver.printers.printer : [driver.printers.printer];
                for (const printerRef of printerRefs) {
                    const printerId = printerRef.id;
                    if (!printerToDrivers.has(printerId)) {
                        printerToDrivers.set(printerId, []);
                    }
                    printerToDrivers.get(printerId).push(driver['@id']);

                    if (!printers.has(printerId)) {
                        const newPrinter = {};
                        newPrinter['@id'] = printerId;
                        const parts = printerId.substring('printer/'.length).split('-');
                        newPrinter.make = parts[0].replace(/_/g, ' ');
                        newPrinter.model = parts.slice(1).join('-').replace(/_/g, ' ');
                        newPrinter.mechanism = {};
                        newPrinter.functionality = '?';
                        newPrinter.driver = driver['@id'].substring('driver/'.length);
                        if (printerRef.comments) {
                            newPrinter.comments = printerRef.comments;
                        }
                        printers.set(printerId, newPrinter);
                    }
                }
            }
        }
    }

    const combinedPrinters = [];
    for (const [printerId, printer] of printers.entries()) {
        const recommendedDriverId = `driver/${printer.driver}`;
        const driverIds = printerToDrivers.get(printerId) || [];

        const driverDetails = driverIds
            .map(driverId => drivers.get(driverId))
            .filter(Boolean) // Filter out undefined drivers
            .map(driver => {
                return {
                    id: driver['@id'],
                    name: driver.name,
                    url: driver.url,
                    comments: driver.comments ? driver.comments.en : '',
                    execution: driver.execution,
                };
            });

        let type = 'unknown';
        if (printer.mechanism) {
            if (printer.mechanism.inkjet !== undefined) {
                type = 'inkjet';
            } else if (printer.mechanism.laser !== undefined) {
                type = 'laser';
            } else if (printer.mechanism.dotmatrix !== undefined) {
                type = 'dot-matrix';
            } else if (printer.mechanism.transfer === 'i') {
                type = 'inkjet';
            }
        }

        combinedPrinters.push({
            id: printer['@id'].replace('printer/', ''),
            manufacturer: printer.make,
            model: printer.model,
            series: '', // Not available
            connectivity: [], // Not available
            recommended_driver: recommendedDriverId,
            drivers: driverDetails,
            type: type,
            status: getFunctionalityStatus(printer.functionality),
            notes: printer.comments ? printer.comments.en : '',
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ printers: combinedPrinters }, null, 2));
    console.log(`Combined data written to ${OUTPUT_FILE}`);
}

combineData();
