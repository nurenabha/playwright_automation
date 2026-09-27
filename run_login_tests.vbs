' Run with:  cscript //nologo run_login_tests.vbs
' Optional args are passed to Playwright, e.g.:  cscript //nologo run_login_tests.vbs --project=chromium
Option Explicit

Dim fso, shell, folder, args, i
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

folder = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = folder

args = ""
For i = 0 To WScript.Arguments.Count - 1
    args = args & " " & WScript.Arguments(i)
Next

' 1 = normal window, True = wait until the run finishes
WScript.Quit shell.Run("cmd /c """ & folder & "\run_login_tests.bat""" & args, 1, True)
