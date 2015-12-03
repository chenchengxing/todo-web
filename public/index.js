
var TodoList = React.createClass({
  getInitialState: function() {
    var self = this;
    return {
      list: self.props.list
    };
  },
  componentDidMount: function() {
      this.refs.myInput.getDOMNode().focus();
      $(this.refs.myInput.getDOMNode()).on('keydown', this.handleKeyDown);
  },

  componentWillUnmount: function() {
      $(this.refs.myInput.getDOMNode()).off('keydown', this.handleKeyDown);
  },
  handle: function (event) {
    this.setState({ value: event.target.value })
  },

  handleKeyDown: function (e) {
    var self = this;
    var ENTER = 13;
    if ( e.keyCode === ENTER ) {

      // console.log(e.target.value)
      var inputValue = e.target.value.trim();
      console.log(typeof inputValue)
      if (inputValue.length) {
        //save
        $.post('/saveTodo', {
          value: inputValue
        }).success(function (todo) {
          if (todo) {
            var list = self.state.list;
            list.push(todo);
            self.setState({
              list: list
            });
            e.target.value = '';
          }
        })
      }
    }
  },
  render: function () {
    var self = this;
    // console.log(this.props.list)
    // var todos = this.props.list.map(function (item) {
    //   return item;
    // });
    var removeTodo = function (todo, index) {
      $.post('/removeTodo', {
        id: todo._id
      }).success(function (response) {
        if (response) {
          console.log('removed')
          var list = self.state.list;
          list.splice(index, 1);
          self.setState({
            list: list
          });
        }
      })
    }
    var markItToday = function (todo, index) {
      if (todo.today) return;
      $.post('/markItToday', {
        id: todo._id
      }).success(function (response) {
        if (response) {
          self.state.list[index].today = true;
          self.forceUpdate();
        }
      })
    }
    var markDone = function (todo, index) {
      $.post('markDone', {
        id: todo._id
      }).success(function (response) {
        self.state.list[index].today = false;
        self.forceUpdate();
      })
    }
    return (
      <div>
        <div className="row">
          <div className="col-lg-4 col-lg-offset-3">
            <input type="text" ref="myInput" placeholder="I want to..." className="form-control"/>
          </div>
        </div>
        <div className="row">

          <div className="col-lg-6">
            <h1>wanderlist:</h1>
            <ul>
              {this.state.list.map(function(todo, j) {
                return (
                  <li>
                    <span key={j}>{todo.name}</span>
                    <a className="btn btn-xs btn-warning" onClick={removeTodo.bind(this, todo, j)}>x</a>
                    {
                      !todo.today ?
                      <a className="btn btn-xs btn-info" onClick={markItToday.bind(this, todo, j)}>mark it today</a>
                      : null
                    }
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-lg-6">
            <h1>today todolist:</h1>
            <ul>
              {
                this.state.list.map(function (todo, i) {
                  if (todo.today) {
                    return (
                      <li>
                        <span key={i}>{todo.name}</span>
                        <a className="btn btn-xs btn-success" onClick={markDone.bind(this, todo, i)}>mark done</a>
                      </li>
                    )
                  }
                })
              }
            </ul>
          </div>

        </div>
      </div>
    );
  }
});

var todos = [];
$.get('/list').success(function (response) {
  todos = response;
  console.log(todos)
  React.render(
    <TodoList list={todos}/>,
    document.getElementById('example')
  );
})
