var ctx = document.getElementById('chart').getContext('2d');

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: regions,
        datasets: [{
            label: 'Number of cases',
            // data: [12, 19, 3, 5, 2, 3],
            data: covidNewCases,
            backgroundColor: [
                '#fafafaff',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                '#f17623ff',
                'rgba(255,255,255,0)',
                '#fafafaff',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
