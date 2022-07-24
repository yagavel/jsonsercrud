import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import axios from 'axios'
import ButtonSave from '../ui/ButtonSave'
const webApi = require('../../api')

interface IOwnProps {
 }

interface IRouteProps {
    customerId: any
}

interface ICustomer {
    id: number
    name: string
    email: string
    address: string
}

interface ICustomerState {
    customer: ICustomer,
    isSaving: boolean
}

export default class CreateEditCustomer extends React.Component<IOwnProps & RouteComponentProps<IRouteProps>, ICustomerState> {
    state: ICustomerState

    constructor(props: any) {
        super(props)
        this.state = {
            customer: {
                id: 0,
                name: '',
                email: '',
                address:''
            },
            isSaving: false
        }
    }

    componentDidMount(){
        this.getCustomerById(this.props.match.params.customerId)
    }

    submit = () => {
        this.setState({ isSaving: true })
        const customerId = this.state.customer.id
        if (customerId !== 0) {
            axios.put(`${webApi.baseApiUrl}customers/${customerId}`, this.state.customer).then(response => {
                alert('Customer updated successfully')
                this.cancelIsSavingState()
                this.props.history.push('/customers')
            }).catch(error => {
                console.log(`${webApi.baseApiUrl}customers/${customerId}`);
                this.cancelIsSavingState()
            })
        } else { // CREATE
            axios.post(`${webApi.baseApiUrl}customers`, this.state.customer).then(response => {
                alert('Customer created successfully!')
                this.cancelIsSavingState()
                this.props.history.push('/customers')
            }).catch(error => {
                console.log(error)
                this.cancelIsSavingState()
            })
        }
    }

    // this to prevent memory leak if the loading is not stop before the this.props.history.push is called
    cancelIsSavingState(): void { 
        this.setState({ isSaving: false })
    }

    getCustomerById(id: number): void {
        if (id) {
            axios.get(`${webApi.baseApiUrl}customers/${id}`).then(response => {
                this.setState({
                    customer: response.data
                })
            }).catch(error => {
                console.log(error)
            })
        }
    }

    handleInputChanges = (e: any) => {
        this.setState({
            
            ...this.state,
            customer: { ... this.state.customer, [e.currentTarget.name]: e.currentTarget.value }
        });
    }

    render() {
        return (
              <div>
                <h3 className="title is-3">{this.state.customer.id !== 0 ? 'Edit' : 'Create'} customer</h3>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input name="name"  value={this.state.customer.name || ''} onChange={(e) => this.handleInputChanges(e)} type="text" className="input" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input name="email" value={this.state.customer.email || ''} onChange={(e) => this.handleInputChanges(e)} type="text" className="input" />
                            </div>
                        </div>
                         <div className="field">
                            <label className="label">Address</label>
                            <div className="control">
                                <input name="address" value={this.state.customer.address || ''} onChange={(e) => this.handleInputChanges(e)} type="text" className="input" />
                            </div>
                        </div>
                    </div>
                    <div className="column"></div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <ButtonSave isSaving={this.state.isSaving} triggerParent={this.submit} />
                        &nbsp;
                        <Link to={'/customers'} className="button">Go back</Link>
                    </div>
                    <div className="level-right"></div>
                </div>
            </div>
        )
    }
}