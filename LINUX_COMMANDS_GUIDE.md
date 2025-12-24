# Linux Commands Guide: cat, ssh, ls, ps, grep

This guide covers essential Linux/Unix commands and explains **when** and **how** to use them in your development workflow.

---

## Table of Contents

1. [cat](#cat---display-file-contents)
2. [ssh](#ssh---secure-shell)
3. [ls](#ls---list-directory-contents)
4. [ps](#ps---process-status)
5. [grep](#grep---search-text)
6. [find](#find---find-files-and-directories)
7. [tail & head](#tail--head---view-file-beginnings-and-ends)
8. [cd & pwd](#cd--pwd---navigate-directories)
9. [mkdir, rm, cp, mv](#mkdir-rm-cp-mv---file-operations)
10. [chmod](#chmod---change-file-permissions)
11. [curl & wget](#curl--wget---download-and-test-apis)
12. [less & more](#less--more---view-large-files)
13. [kill](#kill---terminate-processes)
14. [which & whereis](#which--whereis---find-command-locations)
15. [man](#man---manual-pages)
16. [history](#history---command-history)
17. [Pipes & Redirection](#pipes--redirection---powerful-command-chaining)
18. [Command Chaining](#command-chaining---execute-multiple-commands)

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

## find - Find Files and Directories

### When to Use

- **Locate files** by name, size, type, or modification date
- **Search for files** across entire directory trees
- **Execute commands** on found files
- **Find files** based on complex criteria
- **Complement `grep`** (find finds files, grep finds text in files)

### Common Use Cases

#### 1. Find Files by Name

```bash
find . -name "filename.txt"
find /home -name "*.js"
find . -iname "config.js"  # Case-insensitive
```

**When:** You need to locate specific files in your system.

**Example:**

```bash
find . -name "package.json"
find ~/Documents -name "*.md"
find /var/log -name "*.log"
```

#### 2. Find Directories

```bash
find . -type d -name "node_modules"
find . -type d
```

**When:** Searching for directories instead of files.

#### 3. Find Files by Size

```bash
find . -size +100M        # Files larger than 100MB
find . -size -1k          # Files smaller than 1KB
find . -size +50M -size -100M  # Between 50MB and 100MB
```

**When:** Finding large files taking up disk space.

**Example:**

```bash
# Find large files in current directory
find . -type f -size +100M

# Find and list sizes
find . -type f -size +50M -exec ls -lh {} \;
```

#### 4. Find Files by Modification Time

```bash
find . -mtime -7          # Modified in last 7 days
find . -mtime +30         # Modified more than 30 days ago
find . -mmin -60          # Modified in last 60 minutes
```

**When:** Finding recently changed files or cleaning up old files.

**Example:**

```bash
# Find files modified today
find . -mtime -1

# Find old log files
find /var/log -mtime +90
```

#### 5. Find Files by Permissions

```bash
find . -perm 644          # Files with specific permissions
find . -perm -u+x         # Executable files
```

**When:** Security audits or finding executable files.

#### 6. Find and Execute Commands

```bash
find . -name "*.js" -exec cat {} \;
find . -name "*.log" -exec rm {} \;
find . -name "*.tmp" -delete
```

**When:** Performing actions on found files.

**Example:**

```bash
# Delete all .tmp files
find . -name "*.tmp" -delete

# Count lines in all JavaScript files
find . -name "*.js" -exec wc -l {} \;
```

#### 7. Find Files by Owner

```bash
find . -user username
find . -group groupname
```

**When:** Finding files owned by specific users or groups.

#### 8. Combine Multiple Criteria

```bash
find . -name "*.js" -size +1M -mtime -7
find . -type f -name "*.log" -size +100M
```

**When:** Complex searches with multiple conditions.

#### 9. Exclude Directories

```bash
find . -name "*.js" -not -path "*/node_modules/*"
find . -name "*.js" ! -path "*/node_modules/*"
```

**When:** Searching but excluding certain directories.

**Example:**

```bash
# Find JS files excluding node_modules and .git
find . -name "*.js" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

#### 10. Find Empty Files/Directories

```bash
find . -type f -empty
find . -type d -empty
```

**When:** Cleaning up empty files or directories.

### Important Notes

- 🔍 **Powerful:** More flexible than `ls` for complex searches
- ⚡ **Performance:** Can be slow on large directory trees
- 🎯 **Complements grep:** Use `find` to locate files, `grep` to search content
- ⚠️ **Be careful:** Test `-exec` and `-delete` before using on important files

### Common Patterns

```bash
# Find and delete
find . -name "*.tmp" -delete

# Find and list details
find . -name "*.js" -exec ls -lh {} \;

# Find and count
find . -name "*.js" | wc -l

# Find and grep
find . -name "*.js" -exec grep -l "pattern" {} \;
```

---

## tail & head - View File Beginnings and Ends

### When to Use

- **Monitor log files** in real-time
- **View first/last lines** of files
- **Check file headers** or endings
- **Debug recent issues** in logs
- **Preview large files** without loading entirely

### Common Use Cases

#### 1. View Last Lines (tail)

```bash
tail filename.txt
tail -n 20 filename.txt    # Last 20 lines
tail -20 filename.txt      # Same as above
```

**When:** Checking recent log entries or file endings.

**Example:**

```bash
tail app.log
tail -50 error.log
```

#### 2. Follow Log Files (Real-time)

```bash
tail -f app.log
tail -f /var/log/nginx/access.log
```

**When:** Monitoring logs as they're written (essential for debugging).

**Press `Ctrl+C` to stop following.**

#### 3. View First Lines (head)

```bash
head filename.txt
head -n 10 filename.txt    # First 10 lines
head -10 filename.txt       # Same as above
```

**When:** Previewing file contents or checking headers.

**Example:**

```bash
head package.json
head -20 large-file.csv
```

#### 4. View Lines from Middle

```bash
tail -n +20 filename.txt   # From line 20 to end
head -n 50 filename.txt | tail -n 20  # Lines 31-50
sed -n '20,50p' filename.txt  # Lines 20-50
```

**When:** Viewing specific line ranges.

#### 5. Multiple Files

```bash
tail -f app.log error.log
head *.txt
```

**When:** Monitoring multiple log files simultaneously.

#### 6. Combine with grep

```bash
tail -f app.log | grep "error"
tail -100 app.log | grep -i "exception"
```

**When:** Filtering log output in real-time.

**Example:**

```bash
# Monitor logs and filter errors
tail -f app.log | grep --color=auto -i "error\|exception"

# View last 100 lines and search
tail -100 app.log | grep "user_id"
```

### Important Notes

- 📊 **Log monitoring:** `tail -f` is essential for production debugging
- ⚡ **Performance:** Much faster than `cat` for large files
- 🔄 **Real-time:** `tail -f` updates automatically as file grows
- 📝 **Common use:** Most developers use `tail -f` daily for log monitoring

### Common Patterns

```bash
# Monitor application logs
tail -f app.log

# View recent errors
tail -100 error.log | grep -i error

# Check file structure
head -20 data.csv

# Follow multiple logs
tail -f app.log error.log access.log
```

---

## cd & pwd - Navigate Directories

### When to Use

- **Change current directory** in terminal
- **Navigate file system** efficiently
- **Check current location** in file system
- **Use relative/absolute paths** effectively

### Common Use Cases

#### 1. Change Directory

```bash
cd /path/to/directory
cd ~/Documents
cd ..
cd ../parent-directory
```

**When:** Moving to different directories.

**Example:**

```bash
cd /var/www
cd ~/projects/my-app
cd ..                    # Go up one level
cd ../..                 # Go up two levels
```

#### 2. Go Home Directory

```bash
cd ~
cd
```

**When:** Quickly returning to home directory.

#### 3. Go to Previous Directory

```bash
cd -
```

**When:** Switching between two directories.

**Example:**

```bash
cd /var/www
cd /home/user
cd -    # Returns to /var/www
cd -    # Returns to /home/user
```

#### 4. Print Working Directory (pwd)

```bash
pwd
```

**When:** You need to know your current location.

**Output:**

```
/home/user/projects/my-app
```

#### 5. Navigate with Tab Completion

```bash
cd /ho[TAB]              # Auto-completes to /home
cd ~/Doc[TAB]            # Auto-completes to ~/Documents
```

**When:** Faster navigation (press Tab to auto-complete).

#### 6. Change to Directory from Variable

```bash
cd "$HOME/projects"
cd "$(dirname "$0")"     # Script's directory
```

**When:** Using variables or command substitution.

### Important Notes

- 📁 **Relative paths:** `cd ../sibling` (relative to current)
- 🏠 **Absolute paths:** `cd /home/user` (from root)
- ⚡ **Tab completion:** Use Tab key for faster navigation
- 🔄 **cd -:** Useful for toggling between two directories

### Common Patterns

```bash
# Quick navigation
cd ~/projects/my-app
cd ../sibling-project
cd -

# Check location
pwd

# Navigate from script
cd "$(dirname "$0")"
```

---

## mkdir, rm, cp, mv - File Operations

### When to Use

- **Create directories** (`mkdir`)
- **Remove files/directories** (`rm`)
- **Copy files** (`cp`)
- **Move/rename files** (`mv`)
- **Organize and manage** your file system

### Common Use Cases

#### 1. Create Directory (mkdir)

```bash
mkdir directory-name
mkdir -p path/to/directory    # Create parent directories
mkdir dir1 dir2 dir3           # Create multiple directories
```

**When:** Creating new directories.

**Example:**

```bash
mkdir my-project
mkdir -p src/components/utils
mkdir logs backups temp
```

#### 2. Remove Files (rm)

```bash
rm filename.txt
rm file1.txt file2.txt file3.txt
rm -i filename.txt              # Interactive (asks confirmation)
rm -f filename.txt              # Force (no confirmation)
```

**When:** Deleting files.

**⚠️ Warning:** `rm` permanently deletes files!

#### 3. Remove Directories (rm)

```bash
rm -r directory-name            # Recursive (removes directory and contents)
rm -rf directory-name           # Force recursive (no confirmation)
rmdir empty-directory           # Remove empty directory only
```

**When:** Deleting directories.

**⚠️ Danger:** `rm -rf` is powerful and dangerous - double-check the path!

**Example:**

```bash
rm -r old-backup/
rm -rf node_modules/           # Common: remove dependencies
rmdir empty-folder
```

#### 4. Copy Files (cp)

```bash
cp source.txt destination.txt
cp file.txt /path/to/destination/
cp -r directory/ /path/to/destination/  # Recursive copy
cp file1.txt file2.txt file3.txt dest/  # Copy multiple files
```

**When:** Duplicating files or directories.

**Example:**

```bash
cp config.js config.js.backup
cp -r src/ backup-src/
cp *.txt documents/
```

#### 5. Move/Rename Files (mv)

```bash
mv old-name.txt new-name.txt    # Rename
mv file.txt /path/to/destination/  # Move
mv file1.txt file2.txt file3.txt dest/  # Move multiple files
```

**When:** Renaming files or moving them to different locations.

**Example:**

```bash
mv old-name.js new-name.js
mv file.txt ~/Documents/
mv *.log logs/
```

#### 6. Preserve Attributes

```bash
cp -p source.txt dest.txt       # Preserve timestamps, permissions
cp -a source/ dest/             # Archive mode (preserve everything)
```

**When:** Maintaining file metadata during copy.

### Important Notes

- ⚠️ **rm is permanent:** No undo - be very careful!
- 🔄 **mv is fast:** Moving on same filesystem is instant (just renames pointer)
- 📋 **cp creates copies:** Original file remains
- 🗑️ **rm -rf danger:** Can delete entire system if misused - always verify paths!

### Safety Tips

```bash
# Always verify before rm -rf
ls -la /path/to/delete          # Check what you're deleting
rm -ri directory/               # Interactive mode (safer)

# Use aliases for safety
alias rm='rm -i'                # Always ask before deleting
```

### Common Patterns

```bash
# Backup before deletion
cp important.txt important.txt.backup
rm important.txt

# Organize files
mkdir -p logs/ backups/
mv *.log logs/
cp *.backup backups/

# Clean up
rm -rf node_modules/
rm -rf dist/ build/
```

---

## chmod - Change File Permissions

### When to Use

- **Set file permissions** (read, write, execute)
- **Make scripts executable**
- **Secure sensitive files**
- **Fix permission errors**

### Understanding Permissions

Files have three permission types for three user groups:

```
-rwxrwxrwx
││││││││││
││││││││└─ Others: execute
│││││││└── Others: write
││││││└─── Others: read
│││││└──── Group: execute
││││└───── Group: write
│││└────── Group: read
││└─────── Owner: execute
│└──────── Owner: write
└───────── Owner: read
```

### Common Use Cases

#### 1. Make Script Executable

```bash
chmod +x script.sh
chmod 755 script.sh
```

**When:** Making shell scripts or binaries executable.

**Example:**

```bash
chmod +x deploy.sh
chmod +x my-script.py
```

#### 2. Set Specific Permissions (Numeric)

```bash
chmod 755 filename.txt    # rwxr-xr-x
chmod 644 filename.txt    # rw-r--r--
chmod 600 filename.txt    # rw------- (private)
chmod 777 filename.txt    # rwxrwxrwx (everyone, dangerous!)
```

**When:** Setting exact permission combinations.

**Permission numbers:**

- `4` = read (r)
- `2` = write (w)
- `1` = execute (x)
- Add them: `7 = 4+2+1` (read+write+execute)

**Common permissions:**

- `755` - Owner: full, others: read+execute (common for scripts)
- `644` - Owner: read+write, others: read (common for files)
- `600` - Owner only (private files like `.env`)
- `777` - Everyone full access (avoid in production!)

#### 3. Set Permissions Recursively

```bash
chmod -R 755 directory/
chmod -R +x scripts/
```

**When:** Changing permissions for entire directory trees.

**Example:**

```bash
chmod -R 644 public/
chmod -R +x bin/
```

#### 4. Remove Permissions

```bash
chmod -x script.sh        # Remove execute
chmod -w file.txt         # Remove write
chmod -r file.txt         # Remove read (rare)
```

**When:** Restricting access.

#### 5. Set for Specific Groups

```bash
chmod u+x script.sh       # User (owner) execute
chmod g+w file.txt       # Group write
chmod o-r file.txt       # Others no read
chmod a+x script.sh      # All (everyone) execute
```

**When:** Fine-grained permission control.

### Important Notes

- 🔒 **Security:** Proper permissions prevent unauthorized access
- ⚠️ **777 danger:** Never use `chmod 777` in production - security risk!
- 📝 **Common:** `644` for files, `755` for directories/scripts
- 🔐 **Private:** Use `600` for sensitive files like `.env`

### Common Patterns

```bash
# Make script executable
chmod +x deploy.sh

# Secure sensitive file
chmod 600 .env

# Set directory permissions
chmod 755 public/
chmod -R 644 public/*

# Fix permission errors
chmod -R 755 /var/www
```

---

## curl & wget - Download and Test APIs

### When to Use

- **Test API endpoints** from command line
- **Download files** from internet
- **Check website availability**
- **Send HTTP requests** (GET, POST, PUT, DELETE)
- **Debug API issues**

### Common Use Cases

#### 1. Basic GET Request (curl)

```bash
curl https://api.example.com/users
curl http://localhost:3000/api/users
```

**When:** Testing API endpoints or checking URLs.

**Example:**

```bash
curl https://jsonplaceholder.typicode.com/posts/1
curl http://localhost:3000/health
```

#### 2. Download File (curl)

```bash
curl -O https://example.com/file.txt
curl -o custom-name.txt https://example.com/file.txt
```

**When:** Downloading files from URLs.

#### 3. POST Request (curl)

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

**When:** Sending data to APIs.

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123"}'
```

#### 4. Include Headers (curl)

```bash
curl -H "Authorization: Bearer token123" https://api.example.com/data
curl -H "Content-Type: application/json" \
     -H "X-API-Key: key123" \
     https://api.example.com/data
```

**When:** Testing authenticated endpoints.

#### 5. Save Response to File

```bash
curl -o response.json https://api.example.com/data
curl https://api.example.com/data > response.json
```

**When:** Saving API responses for analysis.

#### 6. Verbose Output (Debug)

```bash
curl -v https://api.example.com/data
curl --verbose https://api.example.com/data
```

**When:** Debugging API issues (shows headers, SSL info).

#### 7. Follow Redirects

```bash
curl -L https://example.com
```

**When:** URLs that redirect to other locations.

#### 8. Download File (wget)

```bash
wget https://example.com/file.txt
wget -O custom-name.txt https://example.com/file.txt
```

**When:** Downloading files (wget is simpler for downloads).

**Example:**

```bash
wget https://nodejs.org/dist/v18.0.0/node-v18.0.0.tar.gz
```

#### 9. Resume Download (wget)

```bash
wget -c https://example.com/large-file.zip
```

**When:** Resuming interrupted downloads.

#### 10. Download Entire Website (wget)

```bash
wget -r -np -k https://example.com/docs/
```

**When:** Mirroring websites (use responsibly!).

### Important Notes

- 🌐 **API testing:** `curl` is essential for testing REST APIs
- 📥 **Downloads:** `wget` is simpler for file downloads
- 🔍 **Debugging:** Use `-v` flag to see full HTTP conversation
- 🔐 **Security:** Be careful with credentials in command history

### Common Patterns

```bash
# Test API endpoint
curl http://localhost:3000/api/users

# POST with JSON
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'

# Download file
wget https://example.com/file.zip

# Test with authentication
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/data
```

---

## less & more - View Large Files

### When to Use

- **View large files** page by page
- **Navigate through files** efficiently
- **Search within files**
- **Better than `cat`** for large files

### Common Use Cases

#### 1. View File (less)

```bash
less filename.txt
cat large-file.log | less
```

**When:** Viewing files larger than a few screens.

**Navigation in `less`:**

- `Space` - Next page
- `b` - Previous page
- `q` - Quit
- `/pattern` - Search forward
- `?pattern` - Search backward
- `n` - Next match
- `N` - Previous match
- `g` - Go to beginning
- `G` - Go to end

#### 2. View File (more)

```bash
more filename.txt
```

**When:** Simple paging (less features than `less`).

**Navigation:** `Space` for next page, `q` to quit.

#### 3. Search While Viewing

```bash
less app.log
# Then type: /error
```

**When:** Finding specific content in large files.

#### 4. View with Line Numbers

```bash
less -N filename.txt
```

**When:** Need line numbers for reference.

### Important Notes

- 📄 **Better than cat:** Use for files larger than terminal screen
- 🔍 **Searchable:** Can search while viewing
- ⬆️⬇️ **Navigable:** Can scroll up and down
- 💡 **Preference:** Most developers prefer `less` over `more`

### Common Patterns

```bash
# View log file
less app.log

# View with line numbers
less -N error.log

# Pipe to less
ps aux | less
git log | less
```

---

## kill - Terminate Processes

### When to Use

- **Stop running processes**
- **Force quit unresponsive applications**
- **Clean up background processes**
- **Free system resources**

### Common Use Cases

#### 1. Kill Process by PID

```bash
kill 1234
kill -9 1234              # Force kill (SIGKILL)
```

**When:** You know the process ID.

**Example:**

```bash
# Find PID first
ps aux | grep node
# Then kill
kill 5678
```

#### 2. Kill by Name

```bash
killall node
killall -9 node           # Force kill
pkill node
pkill -9 node
```

**When:** Killing processes by name.

**Example:**

```bash
killall node              # Kill all node processes
pkill -f "app.js"         # Kill processes matching pattern
```

#### 3. Send Different Signals

```bash
kill -15 PID              # SIGTERM (graceful, default)
kill -9 PID               # SIGKILL (force, cannot be ignored)
kill -2 PID               # SIGINT (like Ctrl+C)
kill -1 PID               # SIGHUP (reload configuration)
```

**When:** Different termination methods.

**Signal meanings:**

- `-15` (SIGTERM) - Ask process to terminate gracefully (default)
- `-9` (SIGKILL) - Force kill immediately (last resort)
- `-2` (SIGINT) - Interrupt (like Ctrl+C)
- `-1` (SIGHUP) - Hang up (often used to reload configs)

#### 4. Kill Process Tree

```bash
pkill -P 1234             # Kill children of PID 1234
killall -r "pattern"       # Kill matching processes recursively
```

**When:** Stopping parent and child processes.

### Important Notes

- ⚠️ **Try graceful first:** Use `kill` (SIGTERM) before `kill -9` (SIGKILL)
- 🔍 **Find PID first:** Use `ps aux | grep` to find process ID
- 💥 **Force kill:** `kill -9` cannot be ignored but may cause data loss
- 🎯 **Best practice:** Give process time to clean up before force killing

### Common Patterns

```bash
# Find and kill
ps aux | grep node
kill <PID>

# Kill all node processes
killall node

# Force kill unresponsive process
kill -9 <PID>

# Graceful shutdown
kill <PID>                # Wait a few seconds
kill -9 <PID>             # Then force if needed
```

---

## which & whereis - Find Command Locations

### When to Use

- **Find executable location** of commands
- **Check which version** of command is being used
- **Debug PATH issues**
- **Locate command binaries**

### Common Use Cases

#### 1. Find Command Location (which)

```bash
which node
which git
which python
```

**When:** Finding where a command is installed.

**Output:**

```
/usr/bin/node
/usr/local/bin/git
```

#### 2. Check All Instances (which -a)

```bash
which -a node
```

**When:** Finding all instances of a command in PATH.

#### 3. Find Command and Documentation (whereis)

```bash
whereis node
whereis git
```

**When:** Finding command, source, and manual pages.

**Output:**

```
node: /usr/bin/node /usr/share/man/man1/node.1.gz
```

#### 4. Verify Command Exists

```bash
which command-name || echo "Command not found"
```

**When:** Checking if command is installed before using it.

### Important Notes

- 🔍 **PATH search:** Searches directories in PATH environment variable
- 📍 **First match:** `which` shows first match in PATH
- 📚 **More info:** `whereis` also finds documentation and source

### Common Patterns

```bash
# Check if command exists
which node && echo "Node.js installed"

# Find all instances
which -a python

# Debug PATH issues
which my-command
echo $PATH
```

---

## man - Manual Pages

### When to Use

- **Get help** for any command
- **Learn command options** and usage
- **Understand command syntax**
- **Find examples** and detailed explanations

### Common Use Cases

#### 1. View Manual Page

```bash
man ls
man grep
man git
```

**When:** Need detailed help for a command.

**Navigation:**

- `Space` - Next page
- `b` - Previous page
- `/pattern` - Search
- `q` - Quit

#### 2. Search Manual Pages

```bash
man -k "search term"
apropos "search term"
```

**When:** Finding commands related to a topic.

**Example:**

```bash
man -k "copy file"
apropos "network"
```

#### 3. Specific Section

```bash
man 1 ls              # Section 1 (user commands)
man 5 passwd           # Section 5 (file formats)
```

**When:** Multiple manual pages exist for same name.

### Important Notes

- 📖 **Built-in help:** Every Linux command should have a manual page
- 🔍 **Searchable:** Can search within manual pages
- 💡 **Learning tool:** Best way to learn command options

### Common Patterns

```bash
# Get help
man command-name

# Search for related commands
man -k "topic"

# Quick reference
man -f command-name    # One-line description
```

---

## history - Command History

### When to Use

- **View previous commands**
- **Reuse commands** without retyping
- **Find commands** you ran earlier
- **Learn from past commands**

### Common Use Cases

#### 1. View History

```bash
history
history | less
history | tail -20
```

**When:** Seeing what commands you've run.

#### 2. Search History

```bash
history | grep "git"
history | grep "npm install"
```

**When:** Finding specific past commands.

#### 3. Execute by Number

```bash
!123                   # Execute command #123
!!                     # Execute last command
!-2                    # Execute 2 commands ago
```

**When:** Reusing previous commands.

#### 4. Search and Execute

```bash
!git                   # Execute last command starting with "git"
!?pattern              # Execute last command containing "pattern"
```

**When:** Quick command reuse.

#### 5. Clear History

```bash
history -c              # Clear current session history
```

**When:** Removing sensitive commands from history.

### Important Notes

- 📜 **Persistent:** History is saved between sessions (usually in `~/.bash_history`)
- 🔍 **Searchable:** Use `Ctrl+R` for interactive history search
- ⚡ **Quick access:** `!!` repeats last command
- 🔒 **Security:** Be careful with sensitive data in history

### Common Patterns

```bash
# Find previous command
history | grep "deploy"

# Repeat last command
!!

# Repeat last git command
!git

# Interactive search (press Ctrl+R)
# Then type part of command
```

---

## Pipes & Redirection - Powerful Command Chaining

### When to Use

- **Chain commands** together
- **Redirect input/output** to files
- **Filter and transform** data
- **Build complex workflows**

### Common Use Cases

#### 1. Pipe Output to Another Command

```bash
command1 | command2
ps aux | grep node
cat file.txt | grep "error" | less
```

**When:** Using one command's output as another's input.

**Example:**

```bash
# Find node processes and count them
ps aux | grep node | grep -v grep | wc -l

# Search logs and view
tail -f app.log | grep "error"
```

#### 2. Redirect Output to File (>)

```bash
command > file.txt
ls -la > file-list.txt
```

**When:** Saving command output to a file (overwrites existing file).

**Example:**

```bash
ps aux > processes.txt
git log > commit-history.txt
```

#### 3. Append to File (>>)

```bash
command >> file.txt
echo "New line" >> log.txt
```

**When:** Adding output to end of existing file.

**Example:**

```bash
echo "$(date): Deployment started" >> deploy.log
```

#### 4. Redirect Input from File (<)

```bash
command < file.txt
sort < unsorted.txt
```

**When:** Using file contents as command input.

**Example:**

```bash
wc -l < large-file.txt
```

#### 5. Redirect Both stdout and stderr (2>&1)

```bash
command > file.txt 2>&1
command >> file.txt 2>&1
```

**When:** Capturing both normal output and errors.

**Example:**

```bash
npm install > install.log 2>&1
```

#### 6. Discard Output (/dev/null)

```bash
command > /dev/null
command 2>/dev/null
command > /dev/null 2>&1
```

**When:** Suppressing output you don't need.

**Example:**

```bash
# Run command silently
npm install > /dev/null 2>&1

# Only suppress errors
command 2>/dev/null
```

#### 7. Multiple Pipes

```bash
command1 | command2 | command3 | command4
```

**When:** Building complex data processing pipelines.

**Example:**

```bash
# Find, filter, sort, and display
ps aux | grep node | grep -v grep | sort -k3 -rn | head -5
```

### Important Notes

- 🔗 **Powerful:** Pipes enable complex data processing
- 📝 **Overwrite:** `>` overwrites, `>>` appends
- 🔄 **Left to right:** Data flows left to right through pipes
- 💡 **Common pattern:** `command | grep | less`

### Common Patterns

```bash
# Filter and view
ps aux | grep node | less

# Save output
command > output.txt

# Append to log
echo "message" >> log.txt

# Suppress output
command > /dev/null 2>&1

# Complex pipeline
cat file.txt | grep "pattern" | sort | uniq | wc -l
```

---

## Command Chaining - Execute Multiple Commands

### When to Use

- **Run commands sequentially**
- **Conditional execution**
- **Execute commands in background**
- **Chain related operations**

### Common Use Cases

#### 1. Sequential Execution (;)

```bash
command1; command2; command3
```

**When:** Run commands one after another (always executes all).

**Example:**

```bash
cd /var/www; git pull; npm install; npm start
```

#### 2. Conditional: Run if Previous Succeeds (&&)

```bash
command1 && command2
```

**When:** Only run second command if first succeeds.

**Example:**

```bash
npm test && npm deploy
git commit -m "message" && git push
cd directory && ls -la
```

#### 3. Conditional: Run if Previous Fails (||)

```bash
command1 || command2
```

**When:** Run second command only if first fails.

**Example:**

```bash
npm install || echo "Installation failed"
git pull || git clone <repo-url>
```

#### 4. Run in Background (&)

```bash
command &
long-running-command &
```

**When:** Running commands that don't need terminal interaction.

**Example:**

```bash
npm start &
node server.js &
```

#### 5. Combine Conditions

```bash
command1 && command2 || command3
```

**When:** Complex conditional logic.

**Example:**

```bash
npm test && npm deploy || echo "Tests failed, deployment cancelled"
```

#### 6. Group Commands

```bash
(command1 && command2) || command3
{ command1; command2; } > output.txt
```

**When:** Treating multiple commands as one unit.

### Important Notes

- ✅ **Success:** `&&` requires previous command to succeed (exit code 0)
- ❌ **Failure:** `||` runs when previous command fails (non-zero exit code)
- 🔄 **Always:** `;` always runs next command regardless
- ⚡ **Background:** `&` runs command in background

### Common Patterns

```bash
# Deploy only if tests pass
npm test && npm deploy

# Try pull, clone if fails
git pull || git clone <repo>

# Run multiple commands
cd /var/www && git pull && npm install && npm start

# Background process
node server.js > server.log 2>&1 &
```

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

| Command   | Primary Use             | Most Common Flags                                              |
| --------- | ----------------------- | -------------------------------------------------------------- |
| `cat`     | Display file contents   | `-n` (line numbers)                                            |
| `ssh`     | Remote server access    | `-p` (port), `-T` (test)                                       |
| `ls`      | List directory contents | `-la` (detailed + hidden)                                      |
| `ps`      | Show running processes  | `aux` (all processes)                                          |
| `grep`    | Search text patterns    | `-r` (recursive), `-i` (case-insensitive), `-n` (line numbers) |
| `find`    | Find files/directories  | `-name`, `-type`, `-size`, `-mtime`                            |
| `tail`    | View file endings       | `-f` (follow), `-n` (lines)                                    |
| `head`    | View file beginnings    | `-n` (lines)                                                   |
| `cd`      | Change directory        | `~` (home), `-` (previous)                                     |
| `pwd`     | Print working directory | (no flags)                                                     |
| `mkdir`   | Create directories      | `-p` (parents)                                                 |
| `rm`      | Remove files            | `-r` (recursive), `-f` (force)                                 |
| `cp`      | Copy files              | `-r` (recursive), `-a` (archive)                               |
| `mv`      | Move/rename files       | (no common flags)                                              |
| `chmod`   | Change permissions      | `+x` (executable), `-R` (recursive), `755`, `644`              |
| `curl`    | HTTP requests/API test  | `-X` (method), `-H` (headers), `-d` (data)                     |
| `wget`    | Download files          | `-O` (output), `-c` (continue)                                 |
| `less`    | View large files        | `-N` (line numbers)                                            |
| `kill`    | Terminate processes     | `-9` (force), `-15` (graceful)                                 |
| `which`   | Find command location   | `-a` (all instances)                                           |
| `man`     | Manual pages            | `-k` (search), section numbers                                 |
| `history` | Command history         | `\| grep` (search), `!!` (repeat last)                         |

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
head -20 file.txt               # First 20 lines
tail -f app.log                 # Follow log file
less file.txt                   # View large file (q to quit)
grep "pattern" file.txt         # Search in file

# File management
cd ~/projects                   # Change directory
pwd                             # Show current directory
mkdir -p path/to/dir            # Create directory
rm -rf directory/               # Remove directory (careful!)
cp -r source/ dest/             # Copy directory
mv old.txt new.txt              # Rename/move file
chmod +x script.sh              # Make executable

# Finding files
find . -name "*.js"             # Find JavaScript files
find . -size +100M              # Find large files
find . -mtime -7                # Modified in last 7 days
which node                      # Find command location

# Process management
ps aux                          # List all processes
ps aux | grep "process"         # Find specific process
kill <PID>                      # Kill process
killall node                    # Kill all node processes
kill -9 <PID>                   # Force kill

# Remote access
ssh user@hostname               # Connect to server
ssh -T git@github.com           # Test GitHub SSH
scp file.txt user@host:/path    # Copy file via SSH

# API/Network testing
curl http://localhost:3000/api  # GET request
curl -X POST url -d '{"key":"val"}'  # POST request
wget https://example.com/file   # Download file

# Search operations
grep -rn "pattern" .            # Recursive search with line numbers
grep -i "pattern" file.txt      # Case-insensitive search
ps aux | grep -v grep | grep node  # Find node processes

# Command chaining
command1 && command2            # Run if first succeeds
command1 || command2            # Run if first fails
command1 | command2             # Pipe output
command > file.txt              # Redirect to file
command >> file.txt             # Append to file

# Help and history
man command                     # Manual page
history | grep "git"            # Search history
!!                              # Repeat last command
```

---

_Last updated: December 2024_
