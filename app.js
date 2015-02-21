/** @jsx React.DOM */
var baseurl = "https://crackling-inferno-3022.firebaseio.com";

var VideoControls = React.createClass({
  mixins: [ReactFireMixin],

  handleVoteDown: function(e) {
    var ref = new Firebase(baseurl + "/videos/" + this.props.index + "/rank");
    ref.transaction(function(currentRank) {
      return currentRank-1;
    });
  },

  handleVoteUp: function(e) {
    var ref = new Firebase(baseurl + "/videos/" + this.props.index + "/rank");
    ref.transaction(function(currentRank) {
      return currentRank+1;
    });
  },

  handleRemove: function(e) {
    var ref = new Firebase(baseurl + "/videos/" + this.props.index);
    ref.remove();
  },

  render: function() {
    return (
      <span className="btn-group pull-right controls">
        <button type="button" className="btn btn-default btn-xs" index={ this.props.index } onClick={ this.handleVoteDown }>
          <span className="glyphicon glyphicon-thumbs-down"></span>
        </button>
        <button type="button" className="btn btn-default btn-xs" index={ this.props.index } onClick={ this.handleVoteUp }>
          <span className="glyphicon glyphicon-thumbs-up"></span>
        </button>
        <button type="button" className="btn btn-default btn-xs" index={ this.props.index } onClick={ this.handleRemove }>
          <span className="glyphicon glyphicon-remove"></span>
        </button>
      </span>
    )
  }
});

var VideoRating = React.createClass({
  render: function() {
    var rank = (this.props.rank === undefined) ? 0 : this.props.rank;
    return <span className="badge">{ rank }</span>
  }
});

var VideoListItem = React.createClass({
  render: function() {
    // console.log(this.props, 'videolistitem');
    return (
      <li className="list-group-item" key={ this.props.index }>
        <VideoControls index={ this.props.index } />
        <VideoRating rank={ this.props.item.rank } />
        { this.props.item.url }
      </li>
    )
  }
});

var VideoList = React.createClass({
  render: function() {
    var rows = [];
    for (var i in this.props.items) {
      rows.push(<VideoListItem index={ i } item={ this.props.items[i] } />);
    }
    return <ul className="list-group">{ rows }</ul>
  }
});

var VideoApp = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {items: []};
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase(baseurl + "/videos/");
    this.bindAsObject(firebaseRef.limitToLast(25), "items");

    firebaseRef.on("value", function(snapshot) {
      this.setState({ items: snapshot.val() });
    }.bind(this));

    // firebaseRef.on("child_added", function(snapshot) {
    //   console.log(snapshot.key());
    // });
    
    // firebaseRef.on("child_removed", function(snapshot) {
    //   console.log(snapshot.key());
    // });
  },

  onChange: function(e) {
    this.setState({url: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.url && this.state.url.trim().length !== 0) {
      this.firebaseRefs["items"].push({
        url: this.state.url
      });
      this.setState({
        url: ""
      });
    }
  },

  render: function() {
    // console.log(this);
    return (
      <div className="col-lg-12">

        <VideoList items={ this.state.items } />
      
        <div className="input-group">
          <form onSubmit={ this.handleSubmit }>
            <input className="form-control" onChange={ this.onChange } value={ this.state.url } placeholder="Enter a youtube url."/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={ this.handleSubmit }>Add</button>
            </span>
          </form>
        </div>
      
      </div>
    )
  }
});

React.render(<VideoApp />, document.getElementById("VideoApp"));
