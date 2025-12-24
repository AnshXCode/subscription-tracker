# Linux Commands Guide: cat, ssh, ls, ps, grep

This guide covers essential Linux/Unix commands and explains **when** and **how** to use them in your development workflow.

---

## Table of Contents

1. [cat](#cat---display-file-contents)
2. [ssh](#ssh---secure-shell)
3. [ls](#ls---list-directory-contents)
4. [ps](#ps---process-status)
5. [grep](#grep---search-text)

---

## cat - Display File Contents

### When to Use

- **View entire file contents** in the terminal
- **Concatenate multiple files** together
- **Create new files** quickly
- **Display file contents** for piping to other commands
- **Check file content** without opening an editor

### Common Use Cases

#### 1. View a Single File

```bash
cat filename.txt
```

**When:** You need to quickly see what's in a file (config files, logs, documentation).

**Example:**

```bash
cat package.json
cat .env
cat README.md
```

#### 2. View Multiple Files

```bash
cat file1.txt file2.txt file3.txt
```

**When:** You want to see contents of multiple files sequentially.

#### 3. Create a New File

```bash
cat > newfile.txt
# Type content, then press Ctrl+D to save
```

**When:** Quick file creation without opening an editor.

#### 4. Append to a File

```bash
cat >> existingfile.txt
# Type content, then press Ctrl+D to append
```

**When:** Adding content to the end of an existing file.

#### 5. Display with Line Numbers

```bash
cat -n filename.txt
```

**When:** You need to see line numbers (useful for debugging or referencing specific lines).

#### 6. Combine with Other Commands

```bash
cat file.txt | grep "error"
cat file1.txt file2.txt > combined.txt
```

**When:** Piping file contents to other commands or combining files.

### Important Notes

- ⚠️ **Don't use `cat` for very large files** - use `less` or `more` instead
- ✅ **Best for:** Small files, configuration files, quick content checks
- ❌ **Not ideal for:** Large log files, binary files

---

## ssh - Secure Shell

### When to Use

- **Connect to remote servers** securely
- **Execute commands on remote machines**
- **Transfer files** securely (with scp/sftp)
- **Git operations** with GitHub/GitLab (using SSH keys)
- **Tunnel network traffic** securely

### Common Use Cases

#### 1. Connect to a Remote Server

```bash
ssh username@hostname
ssh user@192.168.1.100
ssh user@example.com
```

**When:** You need to access a remote server or computer.

**Example:**

```bash
ssh root@myserver.com
ssh deploy@production-server.com
```

#### 2. Connect with Specific Port

```bash
ssh -p 2222 username@hostname
```

**When:** The SSH server is running on a non-standard port (default is 22).

#### 3. Test SSH Connection (GitHub/GitLab)

```bash
ssh -T git@github.com
ssh -T git@gitlab.com
```

**When:** Verifying your SSH key is properly configured for Git operations.

**Expected output:**

```
Hi username! You've successfully authenticated...
```

#### 4. Execute Command on Remote Server

```bash
ssh user@hostname "command"
```

**When:** Running a single command without opening an interactive session.

**Example:**

```bash
ssh deploy@server.com "cd /var/www && git pull"
ssh admin@server.com "systemctl status nginx"
```

#### 5. Copy Files Securely (scp)

```bash
scp file.txt user@hostname:/path/to/destination
scp -r directory/ user@hostname:/path/to/destination
```

**When:** Transferring files to/from remote servers securely.

#### 6. SSH Key Management

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add key to SSH agent
ssh-add ~/.ssh/id_ed25519

# List loaded keys
ssh-add -l
```

**When:** Setting up SSH keys for passwordless authentication.

### Important Notes

- 🔐 **Security:** Always use SSH instead of telnet or unencrypted protocols
- 🔑 **Keys:** SSH keys provide more secure authentication than passwords
- 📝 **Config:** Use `~/.ssh/config` for easier connection management
- ⚠️ **First connection:** You'll be asked to verify the host's fingerprint

### SSH Config Example (~/.ssh/config)

```
Host myserver
    HostName example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Then connect simply with: `ssh myserver`

---

## ls - List Directory Contents

### When to Use

- **See what files/folders** are in a directory
- **Check file permissions** and ownership
- **View file sizes** and modification dates
- **Navigate directories** effectively
- **Verify file existence** before operations

### Common Use Cases

#### 1. Basic Listing

```bash
ls
```

**When:** Quick view of current directory contents.

**Output:**

```
file1.txt  file2.js  directory1/  directory2/
```

#### 2. Detailed Listing (Long Format)

```bash
ls -l
```

**When:** You need to see permissions, ownership, size, and modification date.

**Output:**

```
-rw-r--r-- 1 user group 1024 Dec 21 10:30 file.txt
drwxr-xr-x 2 user group 4096 Dec 20 15:45 directory/
```

**What it shows:**

- File permissions (rwx)
- Number of links
- Owner and group
- File size
- Modification date/time
- File/directory name

#### 3. Show Hidden Files

```bash
ls -a
```

**When:** You need to see hidden files (starting with `.`).

**Example:** `.env`, `.git`, `.ssh`, `.bashrc`

#### 4. Combined Flags (Most Common)

```bash
ls -la
```

**When:** You want detailed listing including hidden files (most common use case).

#### 5. Human-Readable File Sizes

```bash
ls -lh
```

**When:** File sizes in KB, MB, GB instead of bytes.

**Output:**

```
-rw-r--r-- 1 user group 1.2K Dec 21 10:30 file.txt
-rw-r--r-- 1 user group 2.5M Dec 20 15:45 largefile.zip
```

#### 6. Sort by Size

```bash
ls -lhS
```

**When:** Finding largest files in a directory.

#### 7. Sort by Modification Time

```bash
ls -lt
```

**When:** Finding most recently modified files.

#### 8. Reverse Order

```bash
ls -ltr
```

**When:** Oldest files first (reverse time order).

#### 9. List Specific Directory

```bash
ls /path/to/directory
ls ~/Documents
ls ../parent-directory
```

**When:** Viewing contents of a different directory without changing location.

#### 10. List Only Directories

```bash
ls -d */
```

**When:** You only want to see directories, not files.

### Important Notes

- 📁 **Default:** Lists current directory if no path specified
- 🔍 **Colors:** Many systems colorize output (directories in blue, executables in green)
- 📊 **Aliases:** Many users alias `ls` to `ls -lah` for convenience
- ⚡ **Performance:** Fast even with many files

### Common Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'
```

---

## ps - Process Status

### When to Use

- **See running processes** on your system
- **Find process IDs (PIDs)** for killing processes
- **Monitor resource usage** (CPU, memory)
- **Debug application issues** (check if process is running)
- **Identify zombie processes**

### Common Use Cases

#### 1. List Your Processes

```bash
ps
```

**When:** Quick view of processes started by current user in current terminal.

**Output:**

```
  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 5678 pts/0    00:00:02 node
```

#### 2. List All Processes (Most Common)

```bash
ps aux
```

**When:** You need to see ALL processes running on the system.

**What it shows:**

- `a` - all users' processes
- `u` - user-oriented format (shows user, CPU, memory)
- `x` - processes without controlling terminal

**Output:**

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  12345  1234 ?        Ss   Dec20   0:01 /sbin/init
user      5678  2.5  1.2  45678  5678 pts/0    S+   10:30   0:05 node app.js
```

#### 3. Find Specific Process

```bash
ps aux | grep node
ps aux | grep "app.js"
```

**When:** Looking for a specific process by name.

**Example:**

```bash
ps aux | grep nginx
ps aux | grep "mongod"
```

#### 4. Show Process Tree

```bash
ps auxf
```

**When:** Understanding parent-child process relationships.

#### 5. List Processes by User

```bash
ps -u username
```

**When:** See all processes owned by a specific user.

#### 6. Show Full Command Line

```bash
ps auxww
```

**When:** You need to see the complete command with all arguments (useful for debugging).

#### 7. Custom Format (Specific Columns)

```bash
ps -eo pid,user,comm,etime
```

**When:** You only need specific information (PID, user, command, elapsed time).

#### 8. Check if Process is Running

```bash
ps aux | grep -v grep | grep "process-name"
```

**When:** Scripting or checking if a specific application is running.

**Example:**

```bash
# Check if Node.js app is running
ps aux | grep -v grep | grep "node app.js"

# Check if MongoDB is running
ps aux | grep -v grep | grep mongod
```

### Common Combinations

#### Find and Kill Process

```bash
# Find PID
ps aux | grep "process-name"

# Kill process
kill <PID>

# Force kill
kill -9 <PID>
```

#### Monitor Process Resource Usage

```bash
ps aux --sort=-%cpu | head -10  # Top 10 CPU users
ps aux --sort=-%mem | head -10  # Top 10 memory users
```

### Important Notes

- 🔍 **grep -v grep:** Use `grep -v grep` to exclude the grep process itself from results
- 📊 **Real-time:** Use `top` or `htop` for real-time process monitoring
- 🔢 **PID:** Process ID is unique and changes when process restarts
- ⚠️ **Killing:** Be careful when killing processes - use `kill` before `kill -9`

### Related Commands

- `top` - Real-time process monitor
- `htop` - Enhanced version of top (if installed)
- `kill` - Terminate processes
- `pkill` - Kill processes by name
- `pgrep` - Find PIDs by name

---

## grep - Search Text

### When to Use

- **Search for text patterns** in files
- **Filter command output** for specific information
- **Find occurrences** of strings across multiple files
- **Extract specific lines** from files or output
- **Debug logs** by searching for errors or patterns

### Common Use Cases

#### 1. Search in a Single File

```bash
grep "search-term" filename.txt
```

**When:** Finding specific text in a file.

**Example:**

```bash
grep "error" app.log
grep "TODO" app.js
grep "password" config.js
```

#### 2. Case-Insensitive Search

```bash
grep -i "search-term" filename.txt
```

**When:** You don't care about case (Error, ERROR, error all match).

**Example:**

```bash
grep -i "error" app.log
```

#### 3. Search in Multiple Files

```bash
grep "pattern" file1.txt file2.txt file3.txt
grep "pattern" *.js
grep "pattern" **/*.js  # Recursive (if supported)
```

**When:** Searching across multiple files.

**Example:**

```bash
grep "console.log" *.js
grep "import" **/*.js
```

#### 4. Recursive Search (Search in Directories)

```bash
grep -r "pattern" /path/to/directory
grep -r "error" .
```

**When:** Searching through all files in a directory tree.

**Example:**

```bash
grep -r "TODO" .
grep -r "api_key" src/
```

#### 5. Show Line Numbers

```bash
grep -n "pattern" filename.txt
```

**When:** You need to know which line contains the match (useful for editing).

**Output:**

```
42:  const apiKey = "secret";
156:  console.log("API key:", apiKey);
```

#### 6. Show Context (Lines Before/After)

```bash
grep -A 3 "pattern" file.txt  # 3 lines after
grep -B 3 "pattern" file.txt  # 3 lines before
grep -C 3 "pattern" file.txt  # 3 lines before and after
```

**When:** You need to see surrounding context, not just the matching line.

**Example:**

```bash
grep -C 5 "error" app.log  # Shows 5 lines before and after each error
```

#### 7. Invert Match (Show Non-Matching Lines)

```bash
grep -v "pattern" filename.txt
```

**When:** You want lines that DON'T match the pattern.

**Example:**

```bash
# Show all lines except comments
grep -v "^#" config.txt

# Show all processes except grep itself
ps aux | grep -v grep | grep node
```

#### 8. Count Matches

```bash
grep -c "pattern" filename.txt
```

**When:** You only need to know how many times a pattern appears.

**Example:**

```bash
grep -c "error" app.log  # Returns: 42
```

#### 9. Show Only Filenames (Not Content)

```bash
grep -l "pattern" *.js
```

**When:** You only want to know which files contain the pattern.

**Example:**

```bash
grep -l "TODO" **/*.js  # Lists files containing TODO
```

#### 10. Regular Expressions

```bash
grep -E "pattern1|pattern2" file.txt
grep "^start" file.txt      # Lines starting with "start"
grep "end$" file.txt        # Lines ending with "end"
```

**When:** Using advanced pattern matching.

**Example:**

```bash
# Find email addresses
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" file.txt

# Find lines starting with "import"
grep "^import" *.js
```

#### 11. Pipe with Other Commands

```bash
cat file.txt | grep "pattern"
ps aux | grep "node"
git log | grep "fix"
```

**When:** Filtering output from other commands.

**Common Examples:**

```bash
# Find Node.js processes
ps aux | grep node

# Search git commit messages
git log | grep "bug"

# Filter log output
tail -f app.log | grep "error"
```

#### 12. Highlight Matches

```bash
grep --color=auto "pattern" file.txt
```

**When:** Making matches more visible in terminal output.

### Common Real-World Examples

#### Find Errors in Logs

```bash
grep -i "error\|exception\|fatal" app.log
grep -E "error|exception|fatal" app.log
```

#### Search Codebase for Function Usage

```bash
grep -r "functionName" src/
grep -rn "authenticate" . --include="*.js"
```

#### Find Configuration Values

```bash
grep "PORT" .env
grep "database" config/*.js
```

#### Debug: Find All Console Logs

```bash
grep -rn "console\." src/ --include="*.js"
```

#### Find TODO Comments

```bash
grep -rn "TODO\|FIXME\|XXX" . --include="*.js"
```

### Important Notes

- 🔍 **Pattern matching:** grep uses regular expressions by default (basic regex)
- 📝 **Case-sensitive:** By default, grep is case-sensitive (use `-i` for case-insensitive)
- 🚫 **Binary files:** Use `grep -a` to search binary files as text
- ⚡ **Performance:** Very fast even on large files
- 🔄 **Piping:** Often used with pipes (`|`) to filter command output

### Common Flags Summary

| Flag         | Description                            |
| ------------ | -------------------------------------- |
| `-i`         | Case-insensitive search                |
| `-r` or `-R` | Recursive search                       |
| `-n`         | Show line numbers                      |
| `-v`         | Invert match (show non-matching lines) |
| `-c`         | Count matches only                     |
| `-l`         | Show filenames only                    |
| `-A n`       | Show n lines after match               |
| `-B n`       | Show n lines before match              |
| `-C n`       | Show n lines before and after match    |
| `-E`         | Extended regex (or use `egrep`)        |
| `--color`    | Highlight matches                      |
| `-w`         | Match whole words only                 |

### Related Commands

- `egrep` - Extended grep (same as `grep -E`)
- `fgrep` - Fixed string grep (no regex)
- `rg` or `ripgrep` - Faster alternative to grep
- `ag` or `the_silver_searcher` - Another fast grep alternative

---

## Command Combinations (Real-World Examples)

### 1. Find Large Files

```bash
ls -lhS | head -10
```

### 2. Check if Service is Running

```bash
ps aux | grep -v grep | grep nginx
```

### 3. Search Logs for Errors with Context

```bash
grep -C 5 -i "error" app.log | less
```

### 4. Find All JavaScript Files with TODO

```bash
grep -rn "TODO" . --include="*.js"
```

### 5. View Recent Log Entries

```bash
tail -100 app.log | grep "error"
```

### 6. Check SSH Connection

```bash
ssh -T git@github.com
```

### 7. Find and Display File Contents

```bash
cat $(find . -name "config.js") | grep "PORT"
```

### 8. Monitor Process and Filter Output

```bash
ps aux --sort=-%cpu | grep node | head -5
```

---

## Summary Table

| Command | Primary Use             | Most Common Flags                                              |
| ------- | ----------------------- | -------------------------------------------------------------- |
| `cat`   | Display file contents   | `-n` (line numbers)                                            |
| `ssh`   | Remote server access    | `-p` (port), `-T` (test)                                       |
| `ls`    | List directory contents | `-la` (detailed + hidden)                                      |
| `ps`    | Show running processes  | `aux` (all processes)                                          |
| `grep`  | Search text patterns    | `-r` (recursive), `-i` (case-insensitive), `-n` (line numbers) |

---

## Best Practices

1. **Always use `grep -v grep`** when searching process lists to exclude grep itself
2. **Use `ls -lah`** as your default listing command (detailed, all files, human-readable)
3. **Use `ps aux`** for comprehensive process listing
4. **Combine commands with pipes (`|`)** for powerful filtering
5. **Use `grep -r`** for searching codebases
6. **Test SSH connections** before using them in scripts
7. **Avoid `cat` on very large files** - use `less` or `head`/`tail` instead

---

## Quick Reference Cheat Sheet

```bash
# File operations
cat file.txt                    # View file
ls -lah                         # List all files (detailed)
grep "pattern" file.txt         # Search in file

# Process management
ps aux                          # List all processes
ps aux | grep "process"         # Find specific process

# Remote access
ssh user@hostname               # Connect to server
ssh -T git@github.com           # Test GitHub SSH

# Search operations
grep -rn "pattern" .            # Recursive search with line numbers
grep -i "pattern" file.txt      # Case-insensitive search
ps aux | grep -v grep | grep node  # Find node processes
```

---

_Last updated: December 2024_
