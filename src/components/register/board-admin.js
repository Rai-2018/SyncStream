import React, { Component } from "react";

import UserService from "../../services/user-service";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            content: "", 
            users: null
        };
    }
    componentDidMount() {
        UserService.getAdminBoard().then(
            response => {
                this.setState({ content: response.data });
            },

            error => {
                this.setState({ content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString() });
            }
        );
    }

    render() {
        const{users}=this.state

        return (
            <div>
                <header>
                    <h2>Admin</h2>
                    
                    
                </header>
                <p>This page can only be accessed by administrators</p>
                <br />
                    <div>
                        All users from secure (admin only) api end point:
                        
                    </div>
                <p>hello</p>
                <p>{this.state.content}</p>
            </div>
        );
    }
}