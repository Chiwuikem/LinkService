
def select_stock(saving, current_value, future_value):
    memo = {}
    n = len(current_value)

    def helper(i, saving):
        if i == n or saving == 0:
            return 0

        key = (i, saving)
        if key in memo:
            return memo[key]

        # Option 1: Skip current stock
        skip = helper(i + 1, saving)

        take = 0
        # Option 2: Take current stock if affordable
        if current_value[i] <= saving:
            profit = future_value[i] - current_value[i]
            take = profit + helper(i + 1, saving - current_value[i])

        result = max(skip, take)
        memo[key] = result
        return result

    return helper(0, saving)










import java.util.*;
public class Solution {

    public int selectStock(int saving, int[] currentValue, int[] futureValue) {
        int n = currentValue.length;
        Map < String, Integer> memo = new HashMap<>();
        return helper(0, currentValue,  futureValue,  saving, n, memo);

    }

    private int helper(int i, int[] currentValue, int[] futureValue, int saving, int n, Map<String, Integer> memo){
        if (i==n || saving ==0){
            return 0;
        }

        String key = i+","+saving;
        if (memo.containsKey(key)){
            return memo.get(key);
        }

        int skip = helper(i+1, currentValue, futureValue, saving, n, memo );
        
        int take=0;
        if (currentValue[i]<= saving){
            int profit = futureValue[i]- currentValue[i];
            take = profit+ helper(i+1, currentValue, futureValue, saving-currentValue[i], n, memo);
        }
        int res = Math.max(skip, take);
        memo.put(key, res);
        return res;


    }
}