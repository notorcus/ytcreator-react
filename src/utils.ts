// utils.ts
import Papa from 'papaparse';

export interface TimeStamp {
  start: number;
  end: number;
}

export function parseCSV(file: Blob): Promise<TimeStamp[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result;

      Papa.parse(csvData as string, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors);
          } else {
            const data = results.data as { 'Start Time': string, 'End Time': string }[];
            const timeStamps = data.map(({ 'Start Time': start, 'End Time': end }) => ({
              start: convertTimeToSec(start),
              end: convertTimeToSec(end),
            }));
            resolve(timeStamps);
          }
        },
      });
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

function convertTimeToSec(time: string): number {
    const timebase = 24; // This can be adjusted based on the video's frame rate
    const [hours, minutes, seconds, frames] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds + frames / timebase;
  }   
