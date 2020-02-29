import React from 'react';
import ReactContext from './ReduxContext';
import getMapDispatchToProps from './getMapDispatchToProps';
import getMapStateToProps from './getMapStateToProps';

const connect = (mapStateToProps, mapDispatchToProps) => (Comp) => {

	const initStateToProps = getMapStateToProps(mapStateToProps);
	const initDisptchToProps = getMapDispatchToProps(mapDispatchToProps);

	return class WrapedComp extends React.Component {
		static contextType = ReactContext;
		constructor(props) {
			super(props);
			this.state = {
				props: null
			};
		}

		componentDidMount() {
			const { subscribe } = this.context;
			this.unsubscribe = subscribe(this.update);
		}
		componentWillUnmount() {
			if (typeof this.unsubscribe === 'function') {
				this.unsubscribe();
			}
		}

		update = () => {
			const { getState, dispatch } = this.context;
			let stateProps = {};
			let dispatchProps = {};
			stateProps = initStateToProps(getState());
			dispatchProps = initDisptchToProps(dispatch);
			this.setState({
				props: {
					...this.state.props,
					...stateProps,
					...dispatchProps
				}
			});
		}

		render() {
			let { props } = this.state;
			if (props === null) {
				const { getState, dispatch } = this.context;
				let stateProps = {};
				let dispatchProps = {};
				stateProps = initStateToProps(getState());
				dispatchProps = initDisptchToProps(dispatch);
				props = {
					...stateProps,
					...dispatchProps
				}
			}
			return (
				<Comp
					{...props}
				/>
			);
		}
	}
}

export default connect;