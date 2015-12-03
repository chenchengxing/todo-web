React.render(React.createElement(
        'h1',
        null,
        'Hello, ccx!'
), document.getElementById('example'));

var TodoList = React.createClass({
  displayName: 'TodoList',

  getInitialState: function () {
    var self = this;
    return {
      list: self.props.list
    };
  },
  componentDidMount: function () {
    this.refs.myInput.getDOMNode().focus();
    $(this.refs.myInput.getDOMNode()).on('keydown', this.handleKeyDown);
  },

  componentWillUnmount: function () {
    $(this.refs.myInput.getDOMNode()).off('keydown', this.handleKeyDown);
  },
  handle: function (event) {
    this.setState({ value: event.target.value });
  },

  handleKeyDown: function (e) {
    var self = this;
    var ENTER = 13;
    if (e.keyCode === ENTER) {

      // console.log(e.target.value)
      var inputValue = e.target.value.trim();
      console.log(typeof inputValue);
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
        });
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
          console.log('removed');
          var list = self.state.list;
          list.splice(index, 1);
          self.setState({
            list: list
          });
        }
      });
    };
    var markItToday = function (todo, index) {
      if (todo.today) return;
      $.post('/markItToday', {
        id: todo._id
      }).success(function (response) {
        if (response) {
          self.state.list[index].today = true;
          self.forceUpdate();
        }
      });
    };
    var markDone = function (todo, index) {
      $.post('markDone', {
        id: todo._id
      }).success(function (response) {
        self.state.list[index].today = false;
        self.forceUpdate();
      });
    };
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-lg-4 col-lg-offset-3' },
          React.createElement('input', { type: 'text', ref: 'myInput', placeholder: 'I want to...', className: 'form-control' })
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-lg-6' },
          React.createElement(
            'h1',
            null,
            'wanderlist:'
          ),
          React.createElement(
            'ul',
            null,
            this.state.list.map(function (todo, j) {
              return React.createElement(
                'li',
                null,
                React.createElement(
                  'span',
                  { key: j },
                  todo.name
                ),
                React.createElement(
                  'a',
                  { className: 'btn btn-xs btn-warning', onClick: removeTodo.bind(this, todo, j) },
                  'x'
                ),
                !todo.today ? React.createElement(
                  'a',
                  { className: 'btn btn-xs btn-info', onClick: markItToday.bind(this, todo, j) },
                  'mark it today'
                ) : null
              );
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'col-lg-6' },
          React.createElement(
            'h1',
            null,
            'today todolist:'
          ),
          React.createElement(
            'ul',
            null,
            this.state.list.map(function (todo, i) {
              if (todo.today) {
                return React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'span',
                    { key: i },
                    todo.name
                  ),
                  React.createElement(
                    'a',
                    { className: 'btn btn-xs btn-success', onClick: markDone.bind(this, todo, i) },
                    'mark done'
                  )
                );
              }
            })
          )
        )
      )
    );
  }
});

var todos = [];
$.get('/list').success(function (response) {
  todos = response;
  console.log(todos);
  React.render(React.createElement(TodoList, { list: todos }), document.getElementById('example'));
});
