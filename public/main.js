'use strict';

$(document).ready(init);

function init() {
  getAllTodos();
  $('#addTodo').click(addTodo);
  $('#todoTable').on('click', '.remove', removeTodo);
  $('#todoTable').on('click', '.complete', updateComplete)
}

function getAllTodos() {

  $.ajax({
    method: 'GET',
    url: '/todos',
    success: function(todos) {

      var $todos = todos.map(function(todo) {
        var $todo = $('#template').clone();
        $todo.removeAttr('id');
        $todo.find('.desc').text(todo.description);
        $todo.find('.dueDate').text(todo.dueDate);
        //to fix the boolean stringify issue
        if (todo.isComplete === "false") {
          $todo.find('input').prop('checked', false);
        } else if (todo.isComplete === "true") {
          $todo.find('input').prop('checked', true);
          $todo.addClass('complete');
        };
        return $todo;
      });
      $('#todoTable').append($todos);
    }
  });

}

function addTodo() {
  var todo = $('#newTask').val();

  var taskDate = $('#taskDate').val();

  var $todo = $('#template').clone();
  $todo.removeAttr('id');
  $todo.find('.desc').text(todo);
  $todo.find('.dueDate').text(taskDate);
  $todo.find('input').prop('checked', false);

  $('#todoTable').append($todo);

  $('#newTask').val('');
  $('#taskDate').val('');

  $.ajax({
    url: '/todos',
    method: 'POST',
    data: {
      description: todo,
      dueDate: taskDate,
      isComplete: false
    },
    success: function(data) {
      console.log('DATA', data);

    },
    error: function(err) {
      console.log('ERR', err);
    },
  });
}


function removeTodo() {
  var indexV = $(this).parent('tr').index();
  $(this).parent('tr').remove();


  $.ajax({
    url: '/todos/:index',
    method: 'DELETE',
    data: {
      index: indexV
    },
    success: function(data) {
      console.log('deleted from server');
    },
    error: function(err) {
      console.log('ERR', err);
    },
  });
}


function updateComplete() {
  var status = $(this).prop('checked');
  console.log('STATUS', status);

  if (status) {
    $(this).parent().parent().addClass('complete');
  } else {
    $(this).parent().parent().removeClass('complete');
    status = "false";
  }


  var indexS = $(this).parent().parent().index();
  console.log('INDEXS', indexS);

  $.ajax({
    url: '/todos/:index',
    method: 'POST',
    data: {
      Complete: status,
      index: indexS
    },
    success: function(data) {
      console.log('server status updated');
    },
    error: function(err) {
      console.log('ERR', err);

    },
  });
}








//
