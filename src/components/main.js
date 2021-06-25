/**
 * Created by Dima on 03.03.2020.
 */
import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import "./main.css";
import Main_img from './main_img';
import All_nodes from './view_all';
import Add_node from './add_node';
import View_user from './view_user';
import View_search from './view_search';

function Main() {
    return (
        <Router>
            <div className="Main">
                <div className="Main__Top">
                    Телефонный справочник
                </div>
                <div className="Main__Content">
                    <div className="Main__UI">
                        <Switch>
                            <Route exact path="/" component={Main_img}/>
                            <Route path="/sprav" component={All_nodes}/>
                            <Route path="/add" component={Add_node}/>
                            <Route path="/chng" component={Add_node}/>
                            <Route path="/user" component={View_user}/>
                            <Route path="/find" component={View_search}/>
                        </Switch>
                    </div>
                    <div className="Main__Menu">
                        <div className="Menu__Sprav">
                            <Link to="/sprav" className="Menu__Btm">Справочник</Link>
                        </div>
                        <div className="Menu__Find">
                            <Link to="/find" className="Menu__Btm">Поиск</Link>
                        </div>
                        <div className="Menu__Add">
                            <Link to="/add" className="Menu__Btm">Добавить</Link>
                        </div>
                    </div>
                </div>

                <div className="Main__Footer">
                    Semёnochkin © 2020
                </div>
            </div>
        </Router>
    );
}
export default Main;