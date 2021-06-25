/**
 * Created by Dima on 12.03.2020.
 */

import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";

/* Функция отображения карторчки пользователя */
function View_user() {

    /* Удаление записи */
    function delNodeUsr() {

        /* Подтверждение удаления */
        if (window.confirm('Удалить запись о пользователе: ' + user_data.fullname + ' ?'))

            /* Запрос на удаление */
            fetch('/routes/del_node.php?node_id=' + user_data.node_id)
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

    /* Объявление переменных */
    const [user_data, setUser_data] = useState({});
    const [redirect, setRedirect] = useState('');

    /* Обработка любого изменения данных */
    useEffect(() => {

        /* Если нет локальных данных о записи */
        if (!user_data['node_id']) {
            fetch('/routes/get_user.php' + window.location.href.slice(26), {
                method: 'get',
            })
                .then(response => response.json())
                .then(response => {
                    if (response) {
                        /* Отображение данных о записи */
                        setUser_data(response[0]);
                    }
                    else {
                        alert('Ошибка: пользователь не найден');
                        setRedirect(<Redirect to="/"/>)
                    }
                });
        }
    });

    /* Рендеринг в зависимости от имеющихся локальных данных */
    if (user_data['node_id'])
        return (
            <div className="User__data">
                <div>
                    <p className="Label" style={{color:'seagreen'}}>
                    Карточка пользователя
                    </p>
                    <div className="User__name">
                        Имя:<span className="User__data__color">{user_data.fullname}</span>
                    </div>
                    <div className="User__address">
                        Адрес:<span className="User__data__color">{user_data.address}</span>
                    </div>
                    <div className="User__number">
                        Номер телефона:<span className="User__data__color">{user_data.phone_num}</span>
                    </div>
                    <div className="User__create_date">
                        Дата создания записи:<span className="User__data__color">{user_data.create_date}</span>
                    </div>
                    <div className="User__upd_date">
                        Дата последнего изменения:<span className="User__data__color">{user_data.upd_date}</span>
                    </div>
                </div>
                <div className="User__btm">
                    <button className="User__btm_upd" onClick={() => setRedirect(<Redirect to={'/chng?node_id=' + user_data.node_id + '&fullname=' + user_data.fullname + '&address=' + user_data.address + '&number=' + user_data.phone_num}/>)}>
                        Изменить
                    </button><br/>
                    <button className="User__btm_del" onClick={delNodeUsr}>
                        Удалить
                    </button>
                    {redirect}
                </div>
            </div>
        );
    else
        return (
            <div className="User__data">

            </div>
        );
}
export default View_user;