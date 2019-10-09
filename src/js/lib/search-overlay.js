/*
* Created by shate@ya.ru on 09.10.2019
*/
document.addEventListener('DOMContentLoaded', function () {
    try {
        const btn = document.querySelector('.show-overlay');
        const close = document.querySelector('.close');
        const overlay = document.querySelector('.search-overlay');

        btn.addEventListener('click', function () {
            overlay.classList.toggle('open');
        });
        close.addEventListener('click', function () {
            overlay.classList.remove('open');
        })

    } catch (e) {
        console.error(e.message)
    }

});