interface Subtitle {
    start: number;
    end: number;
    text: string;
  }
  
  const parseTime = (time: string): number => {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2].replace(',', '.'));
  
    return hours * 3600 + minutes * 60 + seconds;
  };
  
  const parseSrt = async (srtFile: string): Promise<Subtitle[]> => {
    const response = await fetch(srtFile);
    const srtText = await response.text();
  
    const blocks = srtText.split('\r\n\r\n');
    const subtitles: Subtitle[] = blocks
      .filter(block => block.trim() !== '')  // Remove empty blocks
      .map(block => {
        const lines = block.split('\r\n');
        const times = lines[1].split(' --> ');
        const start = parseTime(times[0]);
        const end = parseTime(times[1]);
        const text = lines.slice(2).join('\r\n');
  
        return { start, end, text };
      });
  
    return subtitles;
  };
  
  
  
  export type { Subtitle };
  export { parseSrt };  