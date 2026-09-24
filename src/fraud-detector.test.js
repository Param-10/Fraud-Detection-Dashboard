/**
 * Fixed-Input Parity Check for FraudDetector Simulation
 *
 * This test verifies that the client-side heuristic simulation produces
 * deterministic, consistent results for fixed inputs. This ensures:
 * 1. The simulation is deterministic (no randomness)
 * 2. Results are reproducible across runs
 * 3. The simulation behavior is documented and verified
 */

import { FraudDetector } from './fraud-detector.js'

// Fixed test input - single transaction with known values
const FIXED_TEST_INPUT = [{
    Time: 1000,
    V1: -0.5, V2: 0.3, V3: -1.2, V4: 0.8, V5: -0.4,
    V6: 0.2, V7: -0.7, V8: 0.1, V9: -0.15, V10: 0.3,
    V11: -0.2, V12: 0.35, V13: -0.1, V14: 0.4, V15: -0.3,
    V16: 0.2, V17: -0.25, V18: 0.15, V19: -0.2, V20: 0.1,
    V21: -0.15, V22: 0.25, V23: -0.3, V24: 0.2, V25: -0.1,
    V26: 0.15, V27: -0.2, V28: 0.1,
    Amount: 150.75
}]

// Expected results for the fixed input (computed from current implementation)
// These values should remain constant unless the simulation logic is intentionally changed
const EXPECTED_RESULTS = {
    prediction: 1,  // 0 = Legitimate, 1 = Fraudulent (based on current heuristic weights)
    // Confidence and score will be verified for consistency, not exact values
    confidenceRange: [0, 1],
    scoreRange: [-Infinity, Infinity]
}

// Additional test cases for edge cases
const EDGE_CASES = [
    {
        name: 'All zeros',
        input: [{
            Time: 0,
            V1: 0, V2: 0, V3: 0, V4: 0, V5: 0,
            V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
            V11: 0, V12: 0, V13: 0, V14: 0, V15: 0,
            V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
            V21: 0, V22: 0, V23: 0, V24: 0, V25: 0,
            V26: 0, V27: 0, V28: 0,
            Amount: 0
        }],
        expectDeterministic: true
    },
    {
        name: 'High amount transaction',
        input: [{
            Time: 50000,
            V1: 2, V2: -1, V3: 3, V4: -2, V5: 1,
            V6: -1, V7: 2, V8: -2, V9: 1, V10: -1,
            V11: 2, V12: -2, V13: 1, V14: -1, V15: 2,
            V16: -2, V17: 1, V18: -1, V19: 2, V20: -2,
            V21: 1, V22: -1, V23: 2, V24: -2, V25: 1,
            V26: -1, V27: 2, V28: -2,
            Amount: 5000
        }],
        expectDeterministic: true
    },
    {
        name: 'Negative amount (edge case)',
        input: [{
            Time: 100,
            V1: 0, V2: 0, V3: 0, V4: 0, V5: 0,
            V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
            V11: 0, V12: 0, V13: 0, V14: 0, V15: 0,
            V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
            V21: 0, V22: 0, V23: 0, V24: 0, V25: 0,
            V26: 0, V27: 0, V28: 0,
            Amount: -100
        }],
        expectDeterministic: true
    }
]

async function runParityCheck() {
    console.log('=== Fixed-Input Parity Check for FraudDetector ===\n')
    
    const detector = new FraudDetector()
    let allPassed = true

    // Test 1: Main fixed input - run multiple times to verify determinism
    console.log('Test 1: Main fixed input (3 consecutive runs)')
    const results = []
    for (let i = 0; i < 3; i++) {
        const prediction = await detector.predict(FIXED_TEST_INPUT)
        results.push(prediction[0])
        console.log(`  Run ${i + 1}: prediction=${prediction[0].prediction}, confidence=${prediction[0].confidence.toFixed(6)}, score=${prediction[0].score.toFixed(6)}`)
    }

    // Verify all runs produce identical results
    const firstResult = results[0]
    const allIdentical = results.every(r => 
        r.prediction === firstResult.prediction &&
        Math.abs(r.confidence - firstResult.confidence) < 1e-10 &&
        Math.abs(r.score - firstResult.score) < 1e-10
    )

    if (allIdentical) {
        console.log('  ✓ PASS: All 3 runs produced identical results (deterministic)\n')
    } else {
        console.log('  ✗ FAIL: Results differ between runs (non-deterministic)\n')
        allPassed = false
    }

    // Verify prediction matches expected
    if (firstResult.prediction === EXPECTED_RESULTS.prediction) {
        console.log(`  ✓ PASS: Prediction matches expected (${EXPECTED_RESULTS.prediction})\n`)
    } else {
        console.log(`  ✗ FAIL: Prediction ${firstResult.prediction} != expected ${EXPECTED_RESULTS.prediction}\n`)
        allPassed = false
    }

    // Verify confidence is in valid range
    if (firstResult.confidence >= 0 && firstResult.confidence <= 1) {
        console.log(`  ✓ PASS: Confidence ${firstResult.confidence.toFixed(6)} in valid range [0, 1]\n`)
    } else {
        console.log(`  ✗ FAIL: Confidence ${firstResult.confidence} outside valid range\n`)
        allPassed = false
    }

    // Test 2: Edge cases
    console.log('Test 2: Edge cases')
    for (const testCase of EDGE_CASES) {
        const results = []
        for (let i = 0; i < 3; i++) {
            const prediction = await detector.predict(testCase.input)
            results.push(prediction[0])
        }

        const firstResult = results[0]
        const allIdentical = results.every(r => 
            r.prediction === firstResult.prediction &&
            Math.abs(r.confidence - firstResult.confidence) < 1e-10 &&
            Math.abs(r.score - firstResult.score) < 1e-10
        )

        if (allIdentical && testCase.expectDeterministic) {
            console.log(`  ✓ PASS: "${testCase.name}" - deterministic (pred=${firstResult.prediction}, conf=${firstResult.confidence.toFixed(6)})`)
        } else if (!allIdentical && testCase.expectDeterministic) {
            console.log(`  ✗ FAIL: "${testCase.name}" - non-deterministic`)
            allPassed = false
        } else {
            console.log(`  ? SKIP: "${testCase.name}" - determinism not expected`)
        }
    }
    console.log()

    // Test 3: Batch processing consistency
    console.log('Test 3: Batch processing (multiple transactions at once)')
    const batchInput = [
        FIXED_TEST_INPUT[0],
        EDGE_CASES[0].input[0],
        EDGE_CASES[1].input[0]
    ]
    const batchResults1 = await detector.predict(batchInput)
    const batchResults2 = await detector.predict(batchInput)
    
    const batchIdentical = batchResults1.every((r, i) => 
        r.prediction === batchResults2[i].prediction &&
        Math.abs(r.confidence - batchResults2[i].confidence) < 1e-10 &&
        Math.abs(r.score - batchResults2[i].score) < 1e-10
    )

    if (batchIdentical) {
        console.log('  ✓ PASS: Batch processing is deterministic\n')
    } else {
        console.log('  ✗ FAIL: Batch processing is non-deterministic\n')
        allPassed = false
    }

    // Test 4: Feature extraction consistency
    console.log('Test 4: Feature extraction completeness')
    const features = detector.extractFeatures(FIXED_TEST_INPUT[0])
    const expectedFeatures = [
        'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
        'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18',
        'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27',
        'V28', 'Amount'
    ]
    const hasAllFeatures = expectedFeatures.every(f => f in features)
    const noExtraFeatures = Object.keys(features).every(f => expectedFeatures.includes(f))

    if (hasAllFeatures && noExtraFeatures) {
        console.log('  ✓ PASS: All 30 expected features extracted, no extras\n')
    } else {
        console.log('  ✗ FAIL: Feature extraction mismatch')
        console.log('    Missing:', expectedFeatures.filter(f => !(f in features)))
        console.log('    Extra:', Object.keys(features).filter(f => !expectedFeatures.includes(f)))
        allPassed = false
    }

    // Summary
    console.log('=== Summary ===')
    if (allPassed) {
        console.log('✓ ALL TESTS PASSED - FraudDetector simulation is deterministic and consistent')
        process.exit(0)
    } else {
        console.log('✗ SOME TESTS FAILED - Review simulation implementation')
        process.exit(1)
    }
}

// Run the parity check
runParityCheck().catch(err => {
    console.error('Error running parity check:', err)
    process.exit(1)
})