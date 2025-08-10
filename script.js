/*
  script.js

  Handles dynamic functionality for the CodeBull teaser site including
  rendering a live‑updating price chart using Chart.js and processing the
  sign‑up form. No data is sent to a server; the form displays a simple
  acknowledgement message on submission.
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Utility function to generate initial chart data. Produces a
     pseudo‑random walk to emulate price movements. */
  function generateData(length = 50) {
    const labels = [];
    const data = [];
    let price = 100;
    for (let i = 0; i < length; i++) {
      price += (Math.random() - 0.5) * 2; // small random fluctuations
      labels.push(i.toString());
      data.push(Number(price.toFixed(2)));
    }
    return { labels, data };
  }

  // Create the chart
  const ctx = document.getElementById('priceChart').getContext('2d');
  const initialData = generateData(60);
  const priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: initialData.labels,
      datasets: [
        {
          label: 'Simulated Price',
          data: initialData.data,
          borderColor: '#00b894',
          backgroundColor: 'rgba(0, 184, 148, 0.1)',
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false
        },
        y: {
          ticks: {
            color: '#555f7a'
          },
          grid: {
            color: '#edf1f7'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });

  // Simulate streaming data by periodically updating the chart
  setInterval(() => {
    const data = priceChart.data.datasets[0].data;
    const labels = priceChart.data.labels;
    const lastPrice = data[data.length - 1];
    const nextPrice = lastPrice + (Math.random() - 0.5) * 2;
    data.push(Number(nextPrice.toFixed(2)));
    labels.push((Number(labels[labels.length - 1]) + 1).toString());
    // Keep the dataset length manageable by removing the oldest entries
    if (data.length > 60) {
      data.shift();
      labels.shift();
    }
    priceChart.update('none');
  }, 1500);

  // Sign‑up form submission handler
  const form = document.getElementById('signup-form');
  const successMsg = document.getElementById('signup-success');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Display success message and hide it after a delay
    successMsg.classList.remove('hidden');
    setTimeout(() => {
      successMsg.classList.add('hidden');
    }, 6000);
    // Clear form
    form.reset();
  });
});