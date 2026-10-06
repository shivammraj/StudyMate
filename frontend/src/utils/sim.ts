import { VisualSpec } from '../types/schemas.js';

export type ArrayStep = {
  kind: 'start' | 'check' | 'move' | 'found' | 'notfound' | 'compare' | 'swap' | 'done';
  line: number;
  message: string;
  array: number[];
  pointers: { low?: number; mid?: number; high?: number; i?: number; j?: number };
  ruledOut: number[];
  swapped?: [number, number];
  found?: number;
  predict?: { question: string; options: string[]; correctIndex: number };
};

export function simulate(
  spec: Extract<VisualSpec, { type: 'array_algorithm' }>,
  overrideTarget?: number | null,
  overrideArray?: number[]
): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const rawArray = overrideArray && overrideArray.length >= 4 ? overrideArray : spec.array;
  const target = overrideTarget !== undefined ? overrideTarget : spec.target ?? 0;

  if (spec.algorithm === 'binary_search') {
    const uniqueSorted = Array.from(new Set(rawArray)).sort((a, b) => a - b);
    const n = uniqueSorted.length;

    let low = 0;
    let high = n - 1;
    const ruledOut = new Set<number>();

    // Step 1: Initialize low and high
    steps.push({
      kind: 'start',
      line: 3,
      message: `Initialize low at index 0 and high at index ${high}.`,
      array: [...uniqueSorted],
      pointers: { low, high },
      ruledOut: [],
    });

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      const midVal = uniqueSorted[mid];

      let correctPredictIndex = 1;
      if (target !== null) {
        if (midVal > target) correctPredictIndex = 0;
        else if (midVal < target) correctPredictIndex = 2;
        else correctPredictIndex = 1;
      }

      steps.push({
        kind: 'check',
        line: 5,
        message: `Examine middle index ${mid} with value ${midVal}.`,
        array: [...uniqueSorted],
        pointers: { low, mid, high },
        ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
        predict: {
          question: `Middle value is ${midVal} and target is ${target}. What should we do?`,
          options: [
            'Search left half (target is smaller)',
            'Found target at middle',
            'Search right half (target is larger)',
          ],
          correctIndex: correctPredictIndex,
        },
      });

      if (target !== null && midVal === target) {
        steps.push({
          kind: 'found',
          line: 7,
          message: `Found target ${target} at index ${mid}!`,
          array: [...uniqueSorted],
          pointers: { low, mid, high },
          ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
          found: mid,
        });
        return steps;
      } else if (target !== null && midVal < target) {
        for (let idx = low; idx <= mid; idx++) {
          ruledOut.add(idx);
        }
        low = mid + 1;
        steps.push({
          kind: 'move',
          line: 9,
          message: `${midVal} is less than ${target}, so rule out left half and move low to ${low}.`,
          array: [...uniqueSorted],
          pointers: { low, high },
          ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
        });
      } else {
        for (let idx = mid; idx <= high; idx++) {
          ruledOut.add(idx);
        }
        high = mid - 1;
        steps.push({
          kind: 'move',
          line: 11,
          message: `${midVal} is greater than ${target}, so rule out right half and move high to ${high}.`,
          array: [...uniqueSorted],
          pointers: { low, high },
          ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
        });
      }
    }

    for (let idx = 0; idx < n; idx++) ruledOut.add(idx);
    steps.push({
      kind: 'notfound',
      line: 14,
      message: `Search range exhausted (low > high). Target ${target} is not in the array.`,
      array: [...uniqueSorted],
      pointers: { low, high },
      ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
    });

    return steps;
  }

  if (spec.algorithm === 'linear_search') {
    const arr = [...rawArray];
    const ruledOut = new Set<number>();

    steps.push({
      kind: 'start',
      line: 2,
      message: `Start scanning from index 0 looking for target ${target}.`,
      array: arr,
      pointers: { i: 0 },
      ruledOut: [],
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        kind: 'compare',
        line: 3,
        message: `Compare element at index ${i} (${arr[i]}) with target ${target}.`,
        array: arr,
        pointers: { i },
        ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
      });

      if (target !== null && arr[i] === target) {
        steps.push({
          kind: 'found',
          line: 4,
          message: `Found target ${target} at index ${i}!`,
          array: arr,
          pointers: { i },
          ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
          found: i,
        });
        return steps;
      }
      ruledOut.add(i);
    }

    steps.push({
      kind: 'notfound',
      line: 7,
      message: `End of array reached without finding target ${target}. Return -1.`,
      array: arr,
      pointers: {},
      ruledOut: Array.from(ruledOut).sort((a, b) => a - b),
    });
    return steps;
  }

  if (spec.algorithm === 'bubble_sort') {
    const arr = [...rawArray];
    const n = arr.length;

    steps.push({
      kind: 'start',
      line: 2,
      message: `Start bubble sort on array of size ${n}.`,
      array: [...arr],
      pointers: { i: 0, j: 0 },
      ruledOut: [],
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          kind: 'compare',
          line: 5,
          message: `Compare adjacent elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`,
          array: [...arr],
          pointers: { i, j },
          ruledOut: [],
        });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          steps.push({
            kind: 'swap',
            line: 6,
            message: `Swap ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`,
            array: [...arr],
            pointers: { i, j },
            ruledOut: [],
            swapped: [j, j + 1],
          });
        }
      }
    }

    steps.push({
      kind: 'done',
      line: 10,
      message: `Array is fully sorted in ascending order.`,
      array: [...arr],
      pointers: {},
      ruledOut: [],
    });

    return steps;
  }

  return steps;
}

export type CircuitSolution = {
  totalOhms: number;
  current: number;
  drops: { label: string; ohms: number; volts: number }[];
  kvl: { sourceVolts: number; dropsTotal: number; residual: number };
};

export type CircuitStep = {
  heading: string;
  message: string;
  highlight: 'source' | 'loop' | 'all' | string;
};

export function solveSeries(
  spec: Extract<VisualSpec, { type: 'circuit_series' }>
): CircuitSolution {
  const totalOhms = spec.resistors.reduce((sum, r) => sum + r.ohms, 0);
  const current = totalOhms > 0 ? spec.voltage / totalOhms : 0;

  const drops = spec.resistors.map((r) => {
    const volts = Number((current * r.ohms).toFixed(4));
    return {
      label: r.label,
      ohms: r.ohms,
      volts,
    };
  });

  const dropsTotal = Number(drops.reduce((sum, d) => sum + d.volts, 0).toFixed(4));
  const residual = Number(Math.abs(spec.voltage - dropsTotal).toFixed(4));

  return {
    totalOhms,
    current: Number(current.toFixed(4)),
    drops,
    kvl: {
      sourceVolts: spec.voltage,
      dropsTotal,
      residual,
    },
  };
}

export function circuitSteps(
  spec: Extract<VisualSpec, { type: 'circuit_series' }>
): CircuitStep[] {
  const sol = solveSeries(spec);
  const steps: CircuitStep[] = [];

  const formulaR = spec.resistors.map((r) => `${r.ohms} Ω`).join(' + ');
  steps.push({
    heading: 'Calculate total resistance',
    message: `Resistors in series add directly: R_total = ${formulaR} = ${sol.totalOhms.toFixed(2)} Ω.`,
    highlight: 'all',
  });

  steps.push({
    heading: "Find circuit current (Ohm's Law)",
    message: `Using I = V / R_total: I = ${spec.voltage} V / ${sol.totalOhms.toFixed(2)} Ω = ${sol.current.toFixed(2)} A.`,
    highlight: 'source',
  });

  const dropsStr = sol.drops
    .map((d) => `V_${d.label} = ${sol.current.toFixed(2)} A × ${d.ohms} Ω = ${d.volts.toFixed(2)} V`)
    .join('; ');
  steps.push({
    heading: 'Calculate voltage drop across each resistor',
    message: `Applying V = I × R for each component: ${dropsStr}.`,
    highlight: 'loop',
  });

  const kvlEquation = `${spec.voltage} V - ` + sol.drops.map((d) => `${d.volts.toFixed(2)} V`).join(' - ') + ` = 0 V`;
  steps.push({
    heading: "Verify with Kirchhoff's Voltage Law",
    message: `The sum of voltages in a closed loop equals zero: ${kvlEquation}. Residual: ${sol.kvl.residual.toFixed(2)} V.`,
    highlight: 'loop',
  });

  return steps;
}
