// scripts.js – adds interactivity to the CodeBull teaser site

/**
 * Generates a random walk (price‑like) time series.
 * @param {number} length Number of points
 * @param {number} start Starting value
 * @returns {number[]} Simulated price sequence
 */
function generateRandomWalk(length, start = 100) {
  const data = [];
  let value = start;
  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * 2; // random change between -1 and 1
    value = Math.max(10, value + change); // prevent negative values
    data.push(parseFloat(value.toFixed(2)));
  }
  return data;
}

/**
 * Initializes the animated hero chart (lightweight sparkline style).
 * Hides axes & legend for visual emphasis.
 */
function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dataLength = 40;
  const initialData = generateRandomWalk(dataLength, 100);
  const labels = Array.from({ length: dataLength }, (_, i) => i);
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(0, 214, 143, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 214, 143, 0)');
  const heroChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: initialData,
          borderColor: '#00d68f',
          borderWidth: 2,
          fill: true,
          backgroundColor: gradient,
          tension: 0.25,
          pointRadius: 0,
        },
      ],
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
  });
  /**
   * Shifts oldest point, appends a new simulated value.
   * Keeps data length constant for smooth scrolling effect.
   */
  function updateChart() {
    const oldData = heroChart.data.datasets[0].data;
    // remove the first element
    oldData.shift();
    // push a new random value based off the last value
    const lastValue = oldData[oldData.length - 1] || 100;
    const change = (Math.random() - 0.5) * 1.2; // slower change
    const nextValue = Math.max(10, lastValue + change);
    oldData.push(parseFloat(nextValue.toFixed(2)));
    // shift labels as well
    heroChart.data.labels.shift();
    heroChart.data.labels.push(heroChart.data.labels[heroChart.data.labels.length - 1] + 1);
    heroChart.update();
  }
  // update every second
  setInterval(updateChart, 1000);
}

/**
 * Binds the historical demo form, generates a capped random walk dataset
 * over the selected date range, and renders a Chart.js line chart.
 */
function initDemo() {
  const form = document.getElementById('demoForm');
  const demoCanvas = document.getElementById('demoChart');
  let demoChart = null;
  if (!form || !demoCanvas) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);
    if (isNaN(start) || isNaN(end) || start >= end) {
      alert('Please choose a valid start and end date.');
      return;
    }
    // determine the number of days between the dates
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const length = Math.min(100, diffDays); // limit to 100 points
    const dataset = generateRandomWalk(length, 50 + Math.random() * 50);
    const labels = Array.from({ length }, (_, i) => {
      const d = new Date(start.getTime());
      d.setDate(start.getDate() + i);
      return d.toISOString().split('T')[0];
    });
    // destroy existing chart if exists
    if (demoChart) {
      demoChart.destroy();
    }
    const ctx = demoCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 214, 143, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 214, 143, 0)');
    demoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Price (simulated)',
            data: dataset,
            borderColor: '#00d68f',
            fill: true,
            backgroundColor: gradient,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Price: ${context.parsed.y.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#8da2bd', maxRotation: 45, minRotation: 45 },
            grid: { display: false },
          },
          y: {
            ticks: { color: '#8da2bd' },
            grid: {
              color: '#143353',
            },
          },
        },
      },
    });
  });
}

/**
 * Inserts static sample leaderboard rows.
 * Could later be replaced by live API feed.
 */
function initLeaderboard() {
  const body = document.getElementById('leaderboardBody');
  if (!body) return;
  const sample = [
    { rank: 1, user: 'AlphaTrader', strategy: 'EMA Crossover', return: 23.5 },
    { rank: 2, user: 'BetaBot', strategy: 'Momentum Bot', return: 18.9 },
    { rank: 3, user: 'GammaAI', strategy: 'Reinforcement Learning', return: 16.2 },
    { rank: 4, user: 'DeltaX', strategy: 'Mean Reversion', return: 12.7 },
    { rank: 5, user: 'OmegaOps', strategy: 'Volatility Breakout', return: 9.4 },
  ];
  let rows = '';
  sample.forEach((item) => {
    rows += `<tr><td>${item.rank}</td><td>${item.user}</td><td>${item.strategy}</td><td>${item.return.toFixed(1)}</td></tr>`;
  });
  body.innerHTML = rows;
}

/**
 * Validates a basic email pattern and displays inline feedback.
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const messageEl = document.getElementById('contactMessage');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      messageEl.textContent = 'Please enter a valid email.';
      messageEl.style.color = '#e74c3c';
      return;
    }
    // Clear input and show success message
    document.getElementById('email').value = '';
    messageEl.textContent = 'Thanks! We will keep you updated.';
    messageEl.style.color = '#00d68f';
  });
}

/**
 * Sets current year in footer.
 */
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Triggers Prism syntax highlighting if loaded.
 */
function initCodeHighlighting() {
  if (window.Prism) {
    Prism.highlightAll();
  }
}

// On page load, initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initHeroChart();
  initDemo();
  initLeaderboard();
  initContactForm();
  setYear();
  initCodeHighlighting();
});