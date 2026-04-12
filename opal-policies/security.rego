package security

default allow_deployment = false

allow_deployment {
    input.riskLevel == "LOW"
    input.confidence >= 0.8
    count(input.criticalIssues) == 0
}

allow_deployment {
    input.riskLevel == "MEDIUM"
    input.confidence >= 0.9
    count(input.criticalIssues) == 0
    has_approval
}

has_approval {
    input.manualApproval == true
}

deny_deployment {
    input.riskLevel == "CRITICAL"
}

deny_deployment {
    input.riskLevel == "HIGH"
    count(input.criticalIssues) > 0
}

deny_deployment {
    input.dangerousPatterns > 0
    not has_exception
}

has_exception {
    input.repository == "test-repo"
    input.branch == "development"
}

deployment_decision = decision {
    allow_deployment
    decision := {
        "allowed": true,
        "reason": "Security checks passed",
        "requiresApproval": false
    }
}

deployment_decision = decision {
    deny_deployment
    decision := {
        "allowed": false,
        "reason": "Security risks detected",
        "requiresApproval": false
    }
}

deployment_decision = decision {
    not allow_deployment
    not deny_deployment
    decision := {
        "allowed": false,
        "reason": "Manual approval required",
        "requiresApproval": true
    }
}
