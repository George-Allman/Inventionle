document.getElementById("donation-button").addEventListener("click", function() {
    window.open("https://www.paypal.com/donate/?hosted_button_id=KJNQXX5XL6UHJ", "_blank")
})
document.getElementById("email-button").addEventListener("click", function() {
    const to = "inventionlegame@gmail.com";
    const subject = "Inventionle Feedback";
    const body = "";
// Encode parameters so special characters don't break the URL
    const mailtoLink = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open in a new tab/window
    window.open(mailtoLink, "_blank");
})