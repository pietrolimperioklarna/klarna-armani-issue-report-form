document.addEventListener('DOMContentLoaded', function() {
    // Prompt for email login
    let reporterEmail = '';
    while (!reporterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
        reporterEmail = prompt("Please enter your email address to log in:");
        if (reporterEmail === null) {
            alert("Email is required to submit a report.");
        }
    }

    const form = document.getElementById('issueForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        messageDiv.style.display = 'none';

        const formData = new FormData(form);

        const data = {
            orderId: formData.get('orderId'),
            paymentReference: formData.get('paymentReference'),
            date: formData.get('date'),
            amount: formData.get('amount'),
            comments: formData.get('comments'),
            reporterEmail: reporterEmail,
            timestamp: new Date().toISOString()
        };

        // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        const scriptURL = 'https://script.google.com/a/macros/klarna.com/s/AKfycbyU5-YBvesS_ro6r86fYfq1JdHuZy2rWm8k86GvDP3REkkINF22t37fteD-wrGif460GA/exec';

        const params = new URLSearchParams({
            orderId: data.orderId,
            paymentReference: data.paymentReference,
            date: data.date,
            amount: data.amount,
            comments: data.comments,
            reporterEmail: data.reporterEmail,
            timestamp: data.timestamp
        });

        const script = document.createElement('script');
        script.src = scriptURL + '?' + params.toString();

        const timeout = setTimeout(() => {
            showMessage('Report submitted successfully!', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
            document.body.removeChild(script);
        }, 2000);

        script.onerror = () => {
            clearTimeout(timeout);
            showMessage('Error submitting report. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
            document.body.removeChild(script);
        };

        document.body.appendChild(script);
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
});
