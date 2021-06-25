/**
 * Created by Dima on 16.03.2020.
 */

import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";

/* Функция отображения поиска */
function View_search() {

    /* Функция обратботки данных поля поиска */
    function searchOnchange(e) {

        /* Обновление значения поискового запроса */
        setSearch_str(e.target.value);

    }

    /* Возвравражещие к верхней записи */
    function scrollingUp() {
        let node_list = document.getElementsByClassName('Search__results')[0];
        if (node_list.scrollTop > 0) {
            node_list.scrollBy(0, -50);
            setTimeout(scrollingUp, 20);
        }
    }

    /* Изменение порядка сортировки */
    function changeNode(e) {
        let cur_node_id = e.target.parentElement.children[0].innerText;
        let cur_node = e.target.parentElement.parentElement.children[0].innerText.split('\n');
        setRedirect(<Redirect
            to={'/chng?node_id=' + cur_node_id + '&fullname=' + cur_node[0] + '&address=' + cur_node[1] + '&number=' + cur_node[2]}/>);
    }

    /* Удаление записи */
    function delNode(e) {

        /* Подтверждение удаления */
        if (window.confirm('Удалить запись о пользователе: ' + e.target.parentElement.parentElement.children[0].innerText.split('\n')[0] + ' ?'))

            /* Запрос на удаление */
            fetch('/routes/del_node.php?node_id=' + e.target.parentElement.children[0].innerText)
                .then(response => response.json())
                .then(response => {

                    /* Перенапровление на главную страницу */
                    if (response === false) {
                        setRedirect(<Redirect to="/sprav"/>)
                    }
                    else {
                        alert('Ошибка при удалении записи');
                    }
                });
    }

    /* Функция обработки формы поиска */
    function submitSearch(e,street = '') {

        /* Запоминаем улицу, если выбран поиск по улице */
        if (!street)
            window.localStorage.setItem('req',window.localStorage.getItem('req')+'|'+search_str);

        /* Запрос на поиск */
        fetch('/routes/search_nodes.php?request=' + (street!==''?street:search_str), {method: 'GET'})
            .then(response => response.json())
            .then(nodes => {
                nodes = nodes.map(node =>
                    <div className="Main__Node">
                        <div className="Node__info"
                             onClick={() => setRedirect(<Redirect to={'/user?id=' + node.node_id}/>)}>
                            {node.fullname}<br/>
                            {node.address}<br/>
                            {node.phone_num}
                        </div>
                        <div className="Node__btm">
                            <div className="Node__id">
                                {node.node_id}
                            </div>
                            <div className="Node__date">
                                Добавлена: {node.create_date}
                            </div>
                            <button className="Node__Chg" onClick={changeNode}>
                                Изменить
                            </button>
                            <br/>
                            <button className="Node__Del" onClick={delNode}>
                                Удалить
                            </button>
                        </div>

                    </div>
                );

                /* Отрисовка результатов поиска */
                setResults(nodes);
            });
    }


    /* Поиск по улице */
    function streetSearch(e) {
        submitSearch({},e.target.value);
    }

    /* Объявление переменных */
    const [search_str, setSearch_str] = useState('');
    const [select_op, setSelect_op] = useState('');
    const [saved_req, setSaved_req] = useState('');
    const [results, setResults] = useState('');
    const [redirect, setRedirect] = useState('');

    /* Обработка любого изменения данных */
    useEffect(() => {
        document.getElementsByTagName('select')[0].size = 1;

        /* Если нет адресов в локальном массиве адресов */
        if (!select_op) {

            /* Запрос на имеющиеся адреса записей */
            fetch('/routes/selected_addr.php', {method: 'GET'})
                .then(response => response.json())
                .then(addresses => {

                    /* Установка полученных адресов */
                    addresses = addresses.map(address =>
                        <option>{address}</option>
                    );
                    setSelect_op(addresses);

                    /* Устновка ранее введенных вариантов поиска*/
                    let saved_req = window.localStorage.getItem('req');
                    if (saved_req) {
                        saved_req = saved_req.split('|');
                        saved_req = saved_req.map(req =>
                            <option>{req}</option>
                        );
                        setSaved_req(saved_req);
                    }
                });
        }
    });

    /* Рендеринг формы поиска */
    return (
        <div className="Search">
            <div>
                <span className="Label">
                    Поиск по справочнику
                </span>
            <div className="Search__field">

                <input type="text" className="Search__input" list="#dl" onChange={searchOnchange}/>
                <datalist id="#dl" className="Search__req">
                    {saved_req}
                </datalist>
                <span className="Search__btm"><a className="Menu__Btm" onClick={submitSearch}>
                    Найти
                </a>
                    </span>
            </div>
            <div className="Search__select">
                <span style={{marginRight:'5px'}}>Поиск по улице</span>
                <select className="Search__street" size="1" onChange={streetSearch}>
                    <option disabled selected>
                        Выберите улицу
                    </option>
                    {select_op}
                </select>
            </div>
            </div>
            <div className="Search__results" onScroll={e => {
                if (e.target.scrollTop) {
                    document.getElementsByClassName('Nodes__up')[0].style.display = 'block';
                    document.getElementsByClassName('Search__results')[0].style.borderTop = 'none';
                    document.getElementsByClassName('Search__results')[0].style.borderBottom = 'solid 2px black';
                }
                else {
                    document.getElementsByClassName('Nodes__up')[0].style.display = 'none';
                    document.getElementsByClassName('Search__results')[0].style.borderTop = 'solid 2px black';
                    document.getElementsByClassName('Search__results')[0].style.borderBottom = 'none';
                }
            }}>
                {results}
            </div>
            <button className="Nodes__up" onClick={scrollingUp}>
                Вверх
            </button>
            {redirect}
        </div>
    );
}
export default View_search;