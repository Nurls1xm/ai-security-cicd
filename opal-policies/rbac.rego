package rbac

import future.keywords.if

default allow_action = false

user_roles := {
    "admin": ["deploy", "approve", "scan", "view"],
    "developer": ["scan", "view"],
    "security": ["approve", "scan", "view"],
    "viewer": ["view"]
}

allow_action if {
    user_has_permission
}

user_has_permission if {
    role := input.user.role
    action := input.action
    action in user_roles[role]
}

allow_deploy if {
    input.user.role == "admin"
}

allow_deploy if {
    input.user.role == "security"
    input.securityApproved == true
}

allow_approve if {
    input.user.role in ["admin", "security"]
}

allow_scan if {
    input.user.role in ["admin", "developer", "security"]
}

audit_log = log if {
    log := {
        "user": input.user.name,
        "role": input.user.role,
        "action": input.action,
        "allowed": allow_action,
        "timestamp": time.now_ns()
    }
}
