<?php

namespace Tests\Unit;

use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TicketPermissionsTest extends TestCase {

    private array $allTicketPermissions = [
        'view own tickets',
        'view all tickets',
        'update ticket status',
        'close ticket',
        'update ticket priority',
        'assign tickets',
        'add closing comment',
    ];

    /** @test */
    public function student_has_correct_ticket_permissions(): void
    {
        $role = Role::findByName('student', 'api');

        $this->assertTrue($role->hasPermissionTo('view own tickets'));
        $this->assertTrue($role->hasPermissionTo('update ticket status'));

        $this->assertFalse($role->hasPermissionTo('view all tickets'));
        $this->assertFalse($role->hasPermissionTo('close ticket'));
        $this->assertFalse($role->hasPermissionTo('update ticket priority'));
        $this->assertFalse($role->hasPermissionTo('assign tickets'));
        $this->assertFalse($role->hasPermissionTo('add closing comment'));
    }

    /** @test */
    public function mentor_has_correct_ticket_permissions(): void
    {
        $role = Role::findByName('mentor', 'api');

        $this->assertTrue($role->hasPermissionTo('view own tickets'));
        $this->assertTrue($role->hasPermissionTo('update ticket status'));
        $this->assertTrue($role->hasPermissionTo('update ticket priority'));
        $this->assertTrue($role->hasPermissionTo('assign tickets'));

        $this->assertFalse($role->hasPermissionTo('view all tickets'));
        $this->assertFalse($role->hasPermissionTo('close ticket'));
        $this->assertFalse($role->hasPermissionTo('add closing comment'));
    }

    /** @test */
    public function admin_has_all_ticket_permissions(): void
    {
        $role = Role::findByName('admin', 'api');

        foreach ($this->allTicketPermissions as $permission) {
            $this->assertTrue(
                $role->hasPermissionTo($permission),
                "admin should have permission: {$permission}"
            );
        }
    }

    /** @test */
    public function superadmin_has_all_ticket_permissions(): void
    {
        $user = $this->createUserWithRole('superadmin');

        foreach ($this->allTicketPermissions as $permission) {
            $this->assertTrue(
                $user->can($permission),
                "superadmin should have permission: {$permission}"
            );
        }
    }
}

?>
