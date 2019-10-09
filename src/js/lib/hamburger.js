/*
* Created by shate@ya.ru on 08.10.2019
*/
document.addEventListener('DOMContentLoaded', function () {
    try {
        const btn = document.querySelector('.hamburger');
        const nav = document.querySelector('.header-nav');
        btn.addEventListener('click', function () {
            this.classList.toggle('hamburger-active');
            nav.classList.toggle('open');
        })

    } catch (e) {
        console.error(e.message)
    }

});