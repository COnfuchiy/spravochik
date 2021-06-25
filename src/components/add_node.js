/**
 * Created by Dima on 08.03.2020.
 */
import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";

/* Функция добавления или изменения записей */
function Add_node(props) {

    /* Функция - обработчик ввода данных в поле имени*/
    function fullnameOnChange(e) {
        let cur_name = e.target.value;
        let regexp = /^([А-Яа-яЁё\s\-]|[\s\.]?[А-Яа-яЁё]\.)+$/;
        if (cur_name.match(regexp)) {//Проверка на корректность ввода с использованием регулярных выражений
            setFullname(cur_name);//Обновление значения имени
            set_error_fullname('');
        }
        else {
            set_error_fullname('Неверное Ф.И.О. пользователя');
        }
    }

    /* Функция - обработчик ввода данных в поле адреса*/
    function addressOnChange(e) {
        let cur_address = e.target.value;
        let regexp = /^([А-Яа-яЁё\s\d\.]+),\s?(([А-Яа-яЁё\s\d\.]|[\s\d])+)$/;

        /* Проверка на корректность ввода с использованием регулярных выражений */
        if (cur_address.match(regexp)) {

            /* Обновление значения адреса */
            setAddress(cur_address);
            set_error_address('');
        }
        else
            set_error_address('Невернвя запись адреса');
    }

    /* Функция - обработчик ввода данных в поле номера телефона */
    function numberOnChange(e) {
        let cur_num = e.target.value;
        let regexp = /\d/g;

        /* Проверка на корректность ввода с использованием регулярных выражений */
        if (cur_num.length >= 11 && cur_num.match(regexp).length === 11) {
            regexp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;
            if (regexp.test(cur_num)) {

                /* Обновление значения номера телефона */
                setNumber(cur_num.match(regexp).join());
                set_error_number('');
            }
            else
                set_error_number('Неверный номер телефона');
        }
        else {
            set_error_number('Количество цифр в номере телефона должно быть равно 11')
        }
    }

    /* Функция обработки формы */
    function handleForm(e) {
        e.preventDefault();
        let fields = document.querySelectorAll('input[type=text]');

        /* Проверка формы на корректность */
        if (!error_fullname && !error_address && !error_number) {

            /* Проверка формы на пустоту */
            if (fields[0].value && fields[1].value && fields[2].value) {
                let error_mess, url;

                /* Выбор добавления или обновления записи исходя из типа страницы */
                if (node_id && type_page !== 'Добавить запись в телефонную книгу') {
                    url = '/routes/upd_node.php';
                    error_mess = 'Ошибка при изменении записи';
                }
                else{
                    error_mess = 'Ошибка при создании записи';
                    url = '/routes/add_node.php';
                }

                /* Запрос к базе данных */
                fetch(url+'?address='+fields[1].value+'&fullname='+fields[0].value+'&number='+fields[2].value+(node_id?'&node_id='+node_id:''), {
                    method: 'get',
                })
                    .then(response => response.json())
                    .then(response => {

                        /* Перенаправление после успешного ответа */
                        if (response === false) {
                            if (node_id)
                                setRedirect(<Redirect to= {'/user?id=' + node_id} />);
                            else
                                setRedirect(<Redirect to= {'/sprav'}/>);
                        }
                        else {
                            alert(error_mess);
                        }
                    });
            }
        }
        else
            alert('Проверьте корректность данных формы');
    }

    /* Объявление переменных */
    const [error_fullname, set_error_fullname] = useState();
    const [error_address, set_error_address] = useState();
    const [error_number, set_error_number] = useState();
    const [fullname, setFullname] = useState();
    const [address, setAddress] = useState();
    const [number, setNumber] = useState();
    const [node_id, setNode_id] = useState();
    const [redirect, setRedirect] = useState('');
    const [type_page, setType_page] = useState('Добавить запись в телефонную книгу');
    const [type_submit, setType_submit] = useState('Добавить');
    useEffect(() => {

        /* Установление типа страницы исходя из запроса */
        if (window.location.href.indexOf('/chng?') !== -1) {
            let url_params = new URLSearchParams(props.location.search);
            if (url_params.get('node_id') && url_params.get('fullname') && url_params.get('address') && url_params.get('number')) {
                document.getElementsByClassName('form__input__fullname')[0].value = url_params.get('fullname');
                setNode_id(url_params.get('node_id'));
                setType_page('Изменение записи пользователя: ' + url_params.get('fullname'));
                document.getElementsByClassName('form__input__address')[0].value = url_params.get('address');
                document.getElementsByClassName('form__input__number')[0].value = url_params.get('number');
                window.history.pushState(null, null, '/chng');
                setType_submit('Обновить');
            }
        }
    });

    /* Рендеринг формы */
    return (
        <div className="Main__add">
            <p className="Label">
                {type_page}
            </p>
            <div className="Menu__form">
            <form className="Form__add" onSubmit={handleForm}>
                <div className="Form__elem">
                    <label htmlFor="input__fullname">Полное имя:</label>
                    <input className="form__input__fullname" type="text" name="input__fullname"
                           onChange={fullnameOnChange} autoComplete="off"/>
                    <div className="tooltip">?
                        <span className="tooltiptext">Только русские буквы и символы "-" и "."</span>
                    </div>
                    <div className="input__fullname__err">
                        {error_fullname}
                    </div>
                </div>
                <div className="Form__elem">
                    <label htmlFor="input__address">Адрес:</label>
                    <input className="form__input__address" type="text" name="input__address" onChange={addressOnChange}
                           autoComplete="off"/>
                    <div className="tooltip">?
                        <span className="tooltiptext">Адрес в формате <br/>"улица, номер дома"</span>
                    </div>
                    <div className="input__address__err">
                        {error_address}
                    </div>
                </div>
                <div className="Form__elem">
                    <label htmlFor="input__number">Номер телефона:</label>
                    <input className="form__input__number" type="text" name="input__number" onChange={numberOnChange}
                           autoComplete="off" />
                    <div className="tooltip">?
                        <span className="tooltiptext">Используйте +7 или 8</span>
                    </div>
                    <div className="input__number__err">
                        {error_number}
                    </div>
                </div>
                <div className="Form__submit">
                    <input type="submit" className="Menu__Btm" value={type_submit}/>
                </div>
            </form>
                {redirect}
            </div>
        </div>
    )
}
export default Add_node;