<?php
 return array (
  'name' => 'news',
  'label' => 'News',
  '_id' => 'news5e4d2a9677096',
  'fields' => 
  array (
    0 => 
    array (
      'name' => 'picture',
      'label' => '',
      'type' => 'image',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    1 => 
    array (
      'name' => 'articles',
      'label' => '',
      'type' => 'repeater',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
        'fields' => 
        array (
          0 => 
          array (
            'type' => 'wysiwyg',
            'name' => 'myWYSIWYGField',
          ),
        ),
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
  ),
  'template' => '',
  'data' => NULL,
  '_created' => 1582115478,
  '_modified' => 1582288802,
  'description' => '',
  'acl' => 
  array (
  ),
);