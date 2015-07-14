// CLIENT-SIDE JAVASCRIPT

$(function() {

  // `postsController` holds all our post funtionality
  var postsController = {
    
    // compile post template
    template: _.template($('#post-template').html()),

    all: function() {
      $.get('/api/posts', function(data) {
        var allPosts = data;
        
        // iterate through allPosts
        _.each(allPosts, function(post) {
          // pass each post object through template and prepend to view
          var $postHtml = $(postsController.template(post));
          $('#post-list').prepend($postHtml);
        });
        // add event-handlers to posts for updating/deleting
        postsController.addEventHandlers();
      });
    },

    create: function(newAuthor, newText) {
      var postData = {author: newAuthor, text: newText};
      // send POST request to server to create new post
      $.post('/api/posts', postData, function(data) {
        // pass post object through template and prepend to view
        var $postHtml = $(postsController.template(data));
        $('#post-list').prepend($postHtml);
      });
    },

    update: function(postId, updatedAuthor, updatedText) {
      // send PUT request to server to update post
      $.ajax({
        type: 'PUT',
        url: '/api/posts/' + postId,
        data: {
          author: updatedAuthor,
          text: updatedText
        },
        success: function(data) {
          // pass post object through template and prepend to view
          var $postHtml = $(postsController.template(data));
          $('#post-' + postId).replaceWith($postHtml);
        }
      });
    },
    
    delete: function(postId) {
      // send DELETE request to server to delete post
      $.ajax({
        type: 'DELETE',
        url: '/api/posts/' + postId,
        success: function(data) {
          // remove deleted post li from the view
          $('#post-' + postId).remove();
        }
      });
    },

    // add event-handlers to posts for updating/deleting
    addEventHandlers: function() {
      $('#post-list')
        // for update: submit event on `.update-post` form
        .on('submit', '.update-post', function(event) {
          event.preventDefault();
          var postId = $(this).closest('.post').attr('data-id');
          var updatedAuthor = $(this).find('.updated-author').val();
          var updatedText = $(this).find('.updated-text').val();
          postsController.update(postId, updatedAuthor, updatedText);
        })
        // for delete: click event on `.delete-post` button
        .on('click', '.delete-post', function(event) {
          event.preventDefault();
          var postId = $(this).closest('.post').attr('data-id');
          postsController.delete(postId);
        });
    },

    setupView: function() {
      // add existing posts to view
      postsController.all();
      
      // add event-handler to new-post form
      $('#new-post').on('submit', function(event) {
        event.preventDefault();
        var newAuthor = $('#new-author').val();
        var newText = $('#new-text').val();
        postsController.create(newAuthor, newText);
        
        // reset the form
        $(this)[0].reset();
        $('#new-text').focus();
      });
    }
  };

  postsController.setupView();

});













