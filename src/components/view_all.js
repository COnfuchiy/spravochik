/**
 * Created by Dima on 07.03.2020.
 */

import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";

/* Функция отображения всех записей */
function All_nodes() {

    /* Переход на страницу с формой изменеия записи */
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
                    if (response === false) {

                        /* Перерисовка записей */
                        setList_nodes([]);
                    }
                    else {
                        alert('Ошибка при удалении записи');
                    }
                });
    }

    /* Изменение порядка сортировки */
    function changeOrder(e) {
        serOrder(e.target.value);

        /* Перерисовка записей */
        setList_nodes([]);
    }

    /* Возвравражещие к верхней записи */
    function scrollingUp() {
        let node_list = document.getElementsByClassName('View__nodes')[0];
        if (node_list.scrollTop > 0) {
            node_list.scrollBy(0, -50);
            setTimeout(scrollingUp, 20);
        }
    }

    /* Объявление переменных */
    const [list_nodes, setList_nodes] = useState([]);
    const [redirect, setRedirect] = useState('');
    const [order, serOrder] = useState('3');

    /* Обработка любого изменения данных */
    useEffect(() => {

        /* Проверка на пустоту записей */
        if (!list_nodes.length)

            /* Запрос на получение записей */
            fetch('/routes/view_all.php?order_by=' + order, {method: 'GET'})
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

                    /* Отображение данных */
                    setList_nodes(nodes);
                });
    });

    /* Рендеринг страницы показа справочника */
    return (
        <div className="View__all">
            <div className="Order__choose">
                <span style={{fontSize: '18px'}}>Сортировать по </span>
                <select className="Order__select" onChange={changeOrder}>
                    <option value="1" className="Order__op">Фамиилии</option>
                    <option value="2" className="Order__op">Адресу</option>
                    <option value="3" className="Order__op" selected>Дате добавления(уб.)</option>
                    <option value="4" className="Order__op">Дате добавления(воз.)</option>
                </select>
            </div>
            <div className="View__nodes" onScroll={e => {
                if (e.target.scrollTop) {
                    document.getElementsByClassName('Nodes__up')[0].style.display = 'block';
                    document.getElementsByClassName('View__nodes')[0].style.borderTop = 'none';
                    document.getElementsByClassName('View__nodes')[0].style.borderBottom = 'solid 2px black';
                }
                else {
                    document.getElementsByClassName('Nodes__up')[0].style.display = 'none';
                    document.getElementsByClassName('View__nodes')[0].style.borderTop = 'solid 2px black';
                    document.getElementsByClassName('View__nodes')[0].style.borderBottom = 'none';
                }
            }}>
                {list_nodes}

            </div>
            <button className="Nodes__up" onClick={scrollingUp}>
                Вверх
            </button>
            {redirect}
        </div>
    );
}
export default All_nodes;