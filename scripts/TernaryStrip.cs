using System;
using System.Text;

public static class TernaryStrip
{
  private static bool IsQuote(char c)
  {
    return c == '\'' || c == '"' || c == '`';
  }

  private static int SkipString(string s, int i)
  {
    char q = s[i];
    i++;
    while (i < s.Length)
    {
      if (s[i] == '\\') { i += 2; continue; }
      if (s[i] == q) return i + 1;
      i++;
    }
    return i;
  }

  private static int SkipTemplate(string s, int i)
  {
    i++;
    while (i < s.Length)
    {
      if (s[i] == '\\') { i += 2; continue; }
      if (s[i] == '`') return i + 1;
      if (s[i] == '$' && i + 1 < s.Length && s[i + 1] == '{')
      {
        i += 2;
        int depth = 1;
        while (i < s.Length && depth > 0)
        {
          if (IsQuote(s[i])) { i = SkipString(s, i); continue; }
          if (s[i] == '{') depth++;
          else if (s[i] == '}') depth--;
          i++;
        }
        continue;
      }
      i++;
    }
    return i;
  }

  private static int ReadUntilColon(string s, int start, out string truePart)
  {
    int depth = 0;
    int i = start;
    while (i < s.Length)
    {
      char c = s[i];
      if (IsQuote(c)) { i = SkipString(s, i); continue; }
      if (c == '`') { i = SkipTemplate(s, i); continue; }
      if (c == '(') depth++;
      else if (c == ')') depth--;
      else if (c == ':' && depth == 0)
      {
        truePart = s.Substring(start, i - start).Trim();
        return i + 1;
      }
      i++;
    }
    truePart = s.Substring(start).Trim();
    return s.Length;
  }

  private static int ReadFalsePart(string s, int start, out string falsePart)
  {
    int depth = 0;
    int qDepth = 0;
    int i = start;
    while (i < s.Length)
    {
      char c = s[i];
      if (IsQuote(c)) { i = SkipString(s, i); continue; }
      if (c == '`') { i = SkipTemplate(s, i); continue; }
      if (c == '(') depth++;
      else if (c == ')') depth--;
      else if (c == '?' && depth == 0) qDepth++;
      else if (c == ':' && depth == 0)
      {
        if (qDepth > 0) { qDepth--; i++; continue; }
        falsePart = s.Substring(start, i - start).Trim();
        return i;
      }
      else if ((c == ',' || c == ';' || c == ')' || c == ']' || c == '}') && depth == 0 && qDepth == 0)
      {
        falsePart = s.Substring(start, i - start).Trim();
        return i;
      }
      i++;
    }
    falsePart = s.Substring(start).Trim();
    return s.Length;
  }

  private static bool MatchCond(string s, int pos, out int condLen)
  {
    string[] conds = new string[] { "hi ?", "lang === 'hi' ?" };
    foreach (string c in conds)
    {
      if (pos + c.Length <= s.Length && s.Substring(pos, c.Length) == c)
      {
        condLen = c.Length;
        return true;
      }
    }
    if (pos + 2 <= s.Length && s.Substring(pos, 2) == "hi")
    {
      int j = pos + 2;
      while (j < s.Length && char.IsWhiteSpace(s[j])) j++;
      if (j < s.Length && s[j] == '?')
      {
        condLen = j - pos + 1;
        return true;
      }
    }
    string langHi = "lang === 'hi'";
    if (pos + langHi.Length <= s.Length && s.Substring(pos, langHi.Length) == langHi)
    {
      int j = pos + langHi.Length;
      while (j < s.Length && char.IsWhiteSpace(s[j])) j++;
      if (j < s.Length && s[j] == '?')
      {
        condLen = j - pos + 1;
        return true;
      }
    }
    condLen = 0;
    return false;
  }

  public static string Strip(string code)
  {
    StringBuilder sb = new StringBuilder();
    int i = 0;
    while (i < code.Length)
    {
      int clen;
      if (MatchCond(code, i, out clen))
      {
        i += clen;
        while (i < code.Length && char.IsWhiteSpace(code[i])) i++;
        string truePart;
        i = ReadUntilColon(code, i, out truePart);
        string falsePart;
        i = ReadFalsePart(code, i, out falsePart);
        sb.Append(falsePart);
        continue;
      }
      sb.Append(code[i]);
      i++;
    }
    return sb.ToString();
  }
}
