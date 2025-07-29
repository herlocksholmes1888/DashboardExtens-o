document.addEventListener("DOMContentLoaded", () => {
    const calendarHead = document.querySelector(".calendarHead h2");
    const daysContainer = document.querySelector(".days");
    const [prevBtn, nextBtn] = document.querySelectorAll(".calendarIcon span");

    let date = new Date(), year = date.getFullYear(), month = date.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const renderCalendar = () => {
        let firstDay = new Date(year, month, 1).getDay(),
            lastDate = new Date(year, month + 1, 0).getDate(),
            prevLastDate = new Date(year, month, 0).getDate(),
            today = new Date(), days = "";

        calendarHead.textContent = `${monthNames[month]} ${year}`;

        for (let i = firstDay; i > 0; i--) days += `<li class="inactive">${prevLastDate - i + 1}</li>`;
        for (let i = 1; i <= lastDate; i++) days += `<li class="${i === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? "active" : ""}">${i}</li>`;

        daysContainer.innerHTML = days;
    };

    [prevBtn, nextBtn].forEach((btn, i) => btn.addEventListener("click", () => {
        month += i ? 1 : -1;
        if (month < 0) (month = 11, year--);
        if (month > 11) (month = 0, year++);
        renderCalendar();
    }));

    renderCalendar();
});