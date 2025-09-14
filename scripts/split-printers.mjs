#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function splitPrintersData() {
  try {
    console.log('🚀 Starting printer data splitting process...')
    
    // Read the original printers.json file
    const printersPath = path.join(__dirname, '..', 'public', 'foomatic-db', 'printers.json')
    const data = JSON.parse(await fs.readFile(printersPath, 'utf-8'))
    
    console.log(`📊 Found ${data.printers.length} printers to process`)
    
    // Create directories for individual printer files
    const printersDir = path.join(__dirname, '..', 'public', 'foomatic-db', 'printers')
    await fs.mkdir(printersDir, { recursive: true })
    
    // Create lightweight index map
    const printersMap = {
      printers: data.printers.map(printer => ({
        id: printer.id,
        manufacturer: printer.manufacturer,
        model: printer.model,
        type: printer.type || 'unknown',
        status: printer.status || 'unknown',
        driverCount: printer.drivers ? printer.drivers.length : 0
      }))
    }
    
    // Write the lightweight index
    const mapPath = path.join(__dirname, '..', 'public', 'foomatic-db', 'printersMap.json')
    await fs.writeFile(mapPath, JSON.stringify(printersMap, null, 2))
    console.log(`✅ Created lightweight index: ${mapPath}`)
    
    // Split into individual files
    let processed = 0
    const batchSize = 100
    
    for (let i = 0; i < data.printers.length; i += batchSize) {
      const batch = data.printers.slice(i, i + batchSize)
      
      await Promise.all(batch.map(async (printer) => {
        const printerPath = path.join(printersDir, `${printer.id}.json`)
        await fs.writeFile(printerPath, JSON.stringify(printer, null, 2))
        processed++
      }))
      
      if (processed % 500 === 0) {
        console.log(`📝 Processed ${processed}/${data.printers.length} printers...`)
      }
    }
    
    console.log(`✅ Successfully split ${data.printers.length} printers into individual files`)
    console.log(`📁 Individual files saved to: ${printersDir}`)
    
    // Calculate size savings
    const originalSize = (await fs.stat(printersPath)).size
    const mapSize = (await fs.stat(mapPath)).size
    const savings = ((originalSize - mapSize) / originalSize * 100).toFixed(1)
    
    console.log(`📊 Size comparison:`)
    console.log(`   Original printers.json: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Lightweight printersMap.json: ${(mapSize / 1024).toFixed(2)} KB`)
    console.log(`   Initial load size reduction: ${savings}%`)
    
  } catch (error) {
    console.error('❌ Error splitting printer data:', error)
    process.exit(1)
  }
}

splitPrintersData()
