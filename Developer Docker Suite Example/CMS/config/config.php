<?php  
   $configs = [];  
   
   $configs['debug'] = 'true';  
   
   if (!empty(getenv('APP_NAME'))){     
      $configs['app.name'] = getenv('APP_NAME'); 
   }  

   if (!empty(getenv('COCKPIT_SESSION_NAME'))){     
     $configs['session.name'] = getenv('COCKPIT_SESSION_NAME'); 
   }  

   if (!empty(getenv('BASE_ROUTE'))){      
      
      // $configs['base_route'] = getenv('BASE_ROUTE');     
      
      // $configs['site_url'] = getenv('BASE_ROUTE');      
      /* $configs['paths'] = [         
         '#root'     => COCKPIT_DIR,         
         '#storage'  => COCKPIT_STORAGE_FOLDER,       
         '#pstorage' => COCKPIT_PUBLIC_STORAGE_FOLDER,     
         '#data'     => COCKPIT_STORAGE_FOLDER.'/data',  
         '#cache'    => COCKPIT_STORAGE_FOLDER.'/cache',     
         '#tmp'      => COCKPIT_STORAGE_FOLDER.'/tmp',     
         '#thumbs'   => COCKPIT_PUBLIC_STORAGE_FOLDER.'/thumbs',      
         '#uploads'  => COCKPIT_PUBLIC_STORAGE_FOLDER.'/uploads',    
         '#modules'  => COCKPIT_DIR.'/modules',     
         '#addons'   => COCKPIT_DIR.'/addons',    
         '#config'   => COCKPIT_CONFIG_DIR,   
         'assets'    => COCKPIT_DIR.'/assets',    
         'site'      => COCKPIT_SITE_DIR     
         ];*/  
    }  

    return $configs;
