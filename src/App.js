import React, { useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://www.terriblytinytales.com/test.txt'
      );
      const content = response.data;
      const words = content.split(/\s+/);
      const wordCounts = {};

      words.forEach((word) => {
        if (word !== '') {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });

      const sortedWords = Object.keys(wordCounts).sort(
        (a, b) => wordCounts[b] - wordCounts[a]
      );

      const topWords = sortedWords.slice(0, 20);
      const histogramData = topWords.map((word) => wordCounts[word]);

      const chartData = {
        options: {
          chart: {
            id: 'wordFrequency',
          },
          xaxis: {
            categories: topWords,
          },
        },
        series: [
          {
            name: 'Word Frequency',
            data: histogramData,
          },
        ],
      };

      setData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.options.xaxis.categories.join(',') +
      '\n' +
      data.series[0].data.join(',');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'histogram.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="container1">
        <button onClick={fetchData} class="custom-btn btn-4"><span>Submit</span></button>
      </div>
      {data && (
        <div className="chart-container">
          <Chart
            options={data.options}
            series={data.series}
            type="bar"
            height={500}
          />
          <div className="container1">
            <button onClick={handleExport} class="custom-btn btn-4"><span>Export</span></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
