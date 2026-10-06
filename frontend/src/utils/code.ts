import { Algorithm } from '../types/schemas.js';

export const REFERENCE_CODE: Record<
  Algorithm,
  {
    language: 'cpp';
    lines: string[];
    complexity: { time: string; space: string };
  }
> = {
  binary_search: {
    language: 'cpp',
    lines: [
      'int binarySearch(vector<int>& arr, int target) {', // 1
      '    int low = 0;', // 2
      '    int high = arr.size() - 1;', // 3
      '    while (low <= high) {', // 4
      '        int mid = low + (high - low) / 2;', // 5
      '        if (arr[mid] == target) {', // 6
      '            return mid;', // 7
      '        } else if (arr[mid] < target) {', // 8
      '            low = mid + 1;', // 9
      '        } else {', // 10
      '            high = mid - 1;', // 11
      '        }', // 12
      '    }', // 13
      '    return -1;', // 14
      '}', // 15
    ],
    complexity: {
      time: 'O(log n)',
      space: 'O(1)',
    },
  },
  linear_search: {
    language: 'cpp',
    lines: [
      'int linearSearch(vector<int>& arr, int target) {', // 1
      '    for (int i = 0; i < arr.size(); i++) {', // 2
      '        if (arr[i] == target) {', // 3
      '            return i;', // 4
      '        }', // 5
      '    }', // 6
      '    return -1;', // 7
      '}', // 8
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  bubble_sort: {
    language: 'cpp',
    lines: [
      'void bubbleSort(vector<int>& arr) {', // 1
      '    int n = arr.size();', // 2
      '    for (int i = 0; i < n - 1; i++) {', // 3
      '        for (int j = 0; j < n - i - 1; j++) {', // 4
      '            if (arr[j] > arr[j + 1]) {', // 5
      '                swap(arr[j], arr[j + 1]);', // 6
      '            }', // 7
      '        }', // 8
      '    }', // 9
      '}', // 10
    ],
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
};
