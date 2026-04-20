<?php

namespace Tests\Feature;

use Tests\TestCase;
use Spatie\Permission\Models\Role;

class DatabaseSeederTest extends TestCase{

    /** @test */
    public function database_seeder_creates_all_roles_required():void{

        foreach(['student', 'mentor', 'admin', 'superadmin'] as $role){
            $this->assertDatabaseHas('roles', ['name' => $role]);
        }
    }
    
     /** @test */
    public function database_seeder_creates_permissions():void{
        
        $this->assertDatabaseHas('permissions', ['name' => 'view resources']);
        $this->assertDatabaseHas('permissions', ['name' => 'manage users']);
        $this->assertDatabaseHas('permissions', ['name' => 'create likes']);
    }

    /** @test */
    public function database_seeder_assigns_correct_permissions_to_roles():void{

        $studentRole = Role::findByName('student', 'api');
        $mentorRole = Role::findByName('mentor', 'api');
        $adminRole = Role::findByName('admin', 'api');
        $superAdminRole = Role::findByName('superadmin', 'api');

        // Check student permissions
        $this->assertTrue($studentRole->hasPermissionTo('view resources'));
        $this->assertFalse($studentRole->hasPermissionTo('manage users'));
        $this->assertTrue($studentRole->hasPermissionTo('create likes'));

        // Check mentor permissions
        $this->assertTrue($mentorRole->hasPermissionTo('view resources'));
        $this->assertFalse($mentorRole->hasPermissionTo('manage users'));
        $this->assertTrue($mentorRole->hasPermissionTo('create likes'));
        $this->assertTrue($mentorRole->hasPermissionTo('edit all resources'));

        // Check admin permissions
        $this->assertTrue($adminRole->hasPermissionTo('view resources'));
        $this->assertTrue($adminRole->hasPermissionTo('manage users'));
        $this->assertTrue($adminRole->hasPermissionTo('create likes'));

        // Check superadmin permissions
        $this->assertTrue($superAdminRole->hasPermissionTo('view resources'));
        $this->assertTrue($superAdminRole->hasPermissionTo('manage users'));
        $this->assertTrue($superAdminRole->hasPermissionTo('create likes'));
    }


}