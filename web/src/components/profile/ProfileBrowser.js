import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import ProfileActionCreator from '../../actions/ProfileActionCreator';
import ProfileThumbnail from './ProfileThumbnail';
import store from '../../stores/Store';

class ProfileBrowser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentPage: 0,
			profilePerPage: 12,
			total: 0
		};

		this.handleLeftButtonClick = this.handleLeftButtonClick.bind(this);
		this.handleRightButtonClick = this.handleRightButtonClick.bind(this);
	}

	componentWillMount() {
		this.initBrowser(this.props);
	}

    componentWillReceiveProps(nextProps) {
		this.initBrowser(nextProps);
	}

	initBrowser(props) {
		if (props.profiles.fetched) {
			this.setState({
				total: props.profiles.data.length
			})
		} else if (props.profile.fetched && !props.profiles.fetching && !props.profiles.error) {
			store.dispatch(ProfileActionCreator.getAll(
				'single',
				props.profile.data.interestedIn,
				props.profile.data.ageMin,
				props.profile.data.ageMax
			));
		}
	}

    render() {
    	if (this.props.profiles.fetched) {
    		let profileList = this.props.profiles.data.filter((elem, index) => {
    			return index >= this.state.currentPage*this.state.profilePerPage
					&& index < (this.state.currentPage+1)*this.state.profilePerPage;
			}).map(profile => {
				return (<div className="profile col-lg-2 col-sm-3 col-xs-4" key={profile.id}>
					<Link to={{
						pathname: "/profile/" + profile.id,
						hash: '#'
					}}>
						<ProfileThumbnail profile={profile} />
					</Link>
				</div>);
			});
    		return (
    			<div className="profile-list row">
					{profileList}
					<div className={"arrow-left" + (this.state.currentPage === 0 ? " disabled" : "")} onClick={this.handleLeftButtonClick}>
						<i className="ion-arrow-left-b"/>
					</div>
					<div className={"arrow-right" + (this.state.currentPage > (this.state.total / this.state.profilePerPage) - 1 ? " disabled" : "")} onClick={this.handleRightButtonClick}>
						<i className="ion-arrow-right-b"/>
					</div>
				</div>
			);
		}
        return <div>Loading data</div>;
    }

	handleRightButtonClick() {
		if (this.state.currentPage < (this.state.total / this.state.profilePerPage) - 1) {
			this.setState({
				currentPage: this.state.currentPage + 1
			});
		}
	}

	handleLeftButtonClick() {
		if (this.state.currentPage !== 0) {
			this.setState({
				currentPage: this.state.currentPage - 1
			});
		}
	}
}

const mapStateToProps = (state) => {
	return {
		facebookAuth: state.facebook.facebookAuth,
		profile: state.profile.profile,
		profiles: state.profile.profiles
	};
};

export default withRouter(connect(mapStateToProps)(ProfileBrowser));
