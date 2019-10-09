/*
* Created by shate@ya.ru on 09.10.2019
*/
function calc (item){
    for (let i = 0; i < item.length; i++) {
        if (!item[i].classList.contains('connect') && (document.documentElement.clientHeight - item[i].getBoundingClientRect().top) > 0) {
            item[i].classList.add('connect');

        }
    }
}

document.addEventListener('scroll', function () {

    const tile = document.querySelectorAll('.tile');
    try {
        if (tile.length) {

               calc(tile);

        }

    } catch (err) {
        console.error('lazy.js', err.message)
    }

});

document.addEventListener('DOMContentLoaded', function () {
    try {
        const tile = document.querySelectorAll('.tile');
        if (tile.length) {
            calc(tile);
        }
    } catch (err) {
        console.error('lazy.js', err.message)
    }
})