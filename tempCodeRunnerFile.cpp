#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> pascalTriangle(int N) {
    vector<vector<int>> ans;
    ans[0][0] = 1;
    for (int i = 1; i < N; i++)
    {
        ans[i][0] = 1;
        for (int j = 1; j < i; j++)
        {
            ans[i][j] = ans[i - 1][j - 1] + ans[i - 1][j];
        }
        ans[i][i] = 1;
    }

    return ans;
}

int main()
{
    vector<vector<int>> sol = pascalTriangle(4);

    for (int i = 0; i < sol.size(); i++)
    {
        for (int j = 0; j < sol[0].size(); j++)
        {
            cout << sol[i][j] << " ";
        }

        cout << endl;
    }
}